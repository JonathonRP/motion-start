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
	// Fires before DOM changes via watch.pre (RENDER_EFFECT phase).
	// When isPresent→false and measurePop is set (popLayout mode), snapshot all siblings,
	// inject position:absolute on the exiting element, then call didUpdate() so siblings
	// FLIP to their new positions immediately — matching framer-motion's getSnapshotBeforeUpdate.
	let prevLayoutDependency: unknown = undefined;
	let prevIsPresent: boolean | undefined = undefined;
	watch.pre(
		[
			() => props.layoutDependency,
			() => props.visualElement?.projection,
			() => props.isPresent,
		],
		() => {
			const { layoutDependency, visualElement, isPresent, measurePop } = props;
			const projection = visualElement?.projection;

			if (!projection) {
				if (prevIsPresent !== isPresent && !isPresent) {
					safeToRemove();
				}
				prevIsPresent = isPresent;
				return;
			}

			projection.isPresent = isPresent;

			if (
				prevLayoutDependency !== layoutDependency ||
				layoutDependency === undefined
			) {
				projection.willUpdate();
			} else if (prevIsPresent === isPresent) {
				// Layout stable AND presence stable — element can be safely removed
				safeToRemove();
			}

			if (prevIsPresent !== isPresent) {
				if (isPresent) {
					projection.promote();
				} else {
					// popLayout: snapshot is already taken by willUpdate() above.
					// Now inject position:absolute so siblings shift, then call didUpdate()
					// to animate siblings from their snapshotted positions to their new ones.
					if (measurePop) {
						measurePop(visualElement.current as HTMLElement | SVGElement);
						projection.root!.didUpdate();
					}

					if (!projection.relegate()) {
						frame.postRender(() => {
							const stack = projection.getStack();
							if (!stack || !stack.members.length) {
								safeToRemove();
							}
						});
					}
				}
			}

			// When transitioning to not-present, keep prevLayoutDependency as undefined
			// so subsequent renders during exit animation always call willUpdate(), never safeToRemove().
			prevLayoutDependency = isPresent ? layoutDependency : undefined;
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
