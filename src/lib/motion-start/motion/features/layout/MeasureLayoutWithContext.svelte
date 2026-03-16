<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
	import { watch } from "runed";
	import { onDestroy, onMount } from "svelte";
	import { frame } from "../../../frameloop";
	import { microtask } from "../../../frameloop/microtask";
	import { globalProjectionState } from "../../../projection/node/state";
	import { correctBorderRadius } from "../../../projection/styles/scale-border-radius";
	import { correctBoxShadow } from "../../../projection/styles/scale-box-shadow";
	import { addScaleCorrector } from "../../../projection/styles/scale-correction";
	import type { MeasureProps } from "./MeasureLayout.svelte";

	const defaultScaleCorrectors = {
		borderRadius: {
			...correctBorderRadius,
			applyTo: [
				"borderTopLeftRadius",
				"borderTopRightRadius",
				"borderBottomLeftRadius",
				"borderBottomRightRadius",
			],
		},
		borderTopLeftRadius: correctBorderRadius,
		borderTopRightRadius: correctBorderRadius,
		borderBottomLeftRadius: correctBorderRadius,
		borderBottomRightRadius: correctBorderRadius,
		boxShadow: correctBoxShadow,
	};

	const props: MeasureProps = $props();

	const safeToRemove = () => props.safeToRemove?.();

	// componentDidMount
	onMount(() => {
		const { visualElement, layoutGroup, switchLayoutGroup, layoutId } = props;
		const { projection } = visualElement;

		addScaleCorrector(defaultScaleCorrectors);

		if (projection) {
			if (layoutGroup.group) layoutGroup.group.add(projection);

			if (switchLayoutGroup && switchLayoutGroup.register && layoutId) {
				switchLayoutGroup.register(projection);
			}

			projection.root!.didUpdate();
			projection.addEventListener("animationComplete", () => {
				safeToRemove();
			});
			projection.setOptions({
				...projection.options,
				onExitComplete: () => safeToRemove(),
			});
		}

		globalProjectionState.hasEverUpdated = true;
	});

	// getSnapshotBeforeUpdate — mirrors React's getSnapshotBeforeUpdate.
	// Fires before DOM changes via watch.pre. Deps: snapshotDependency (bumped via flushSync
	// before DOM removal), layoutDependency (for drag/manual layout changes), projection, isPresent.
	let prevSnapshotKey: number | undefined = undefined;
	let prevIsPresent: boolean | undefined = undefined;
	watch.pre(
		[
			() => props.snapshotDependency,
			() => props.layoutDependency,
			() => props.visualElement?.projection,
			() => props.isPresent,
		],
		() => {
			const { snapshotDependency, layoutDependency, visualElement, drag, isPresent } = props;
			const projection = visualElement?.projection;
			// Use whichever snapshot key changed most recently as the trigger signal
			const snapshotKey = snapshotDependency ?? layoutDependency;

			if (!projection) {
				if (prevIsPresent !== isPresent && !isPresent) {
					safeToRemove();
				}
				prevIsPresent = isPresent;
				return;
			}

			projection.isPresent = isPresent;

			if (
				drag ||
				prevSnapshotKey !== snapshotKey ||
				snapshotKey === undefined
			) {
				projection.willUpdate();
			} else if (prevIsPresent === isPresent) {
				// Layout stable AND presence stable — element can be safely removed
				safeToRemove();
			}

			if (prevIsPresent !== isPresent) {
				if (isPresent) {
					projection.promote();
				} else if (!projection.relegate()) {
					frame.postRender(() => {
						const stack = projection.getStack();
						if (!stack || !stack.members.length) {
							safeToRemove();
						}
					});
				}
			}

			// When transitioning to not-present, keep prevSnapshotKey as undefined
			// so subsequent renders during exit animation always call willUpdate(), never safeToRemove().
			prevSnapshotKey = isPresent ? snapshotKey : undefined;
			prevIsPresent = isPresent;
		},
	);

	// componentDidUpdate — re-runs on layoutDependency change.
	// Uses watch (EFFECT phase, post-DOM) so didUpdate() sees the committed DOM.
	watch(
		() => props.layoutDependency,
		() => {
			if (props.visualElement?.projection) {
				const { projection } = props.visualElement;
				projection.root!.didUpdate();

				microtask.postRender(() => {
					if (!projection.currentAnimation && projection.isLead()) {
						safeToRemove();
					}
				});
			}
		},
	);

	// component will unmount
	onDestroy(() => {
		const { visualElement, layoutGroup, switchLayoutGroup } = props;
		if (visualElement?.projection) {
			const { projection } = visualElement;
			projection.scheduleCheckAfterUnmount();
			if (layoutGroup && layoutGroup.group)
				layoutGroup.group.remove(projection);
			if (switchLayoutGroup && switchLayoutGroup.deregister)
				switchLayoutGroup.deregister(projection);
		}
	});
</script>
