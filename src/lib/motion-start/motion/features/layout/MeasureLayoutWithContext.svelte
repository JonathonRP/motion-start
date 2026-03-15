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

	interface Props extends MeasureProps {}

	const props: Props = $props();

	const safeToRemove = () => {
		const { safeToRemove } = props;
		safeToRemove && safeToRemove();
	};

	// componentDidMount
	onMount(() => {
		const { visualElement, layoutGroup, switchLayoutGroup, layoutId } =
			props;
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
	// Watches _renderCount (bumped on every configAndProps change in index.svelte.ts)
	// and projection changes. Uses separate prev-value tracking for layoutDependency
	// and isPresent to correctly detect changes (getter-based props always return current
	// values, so we cannot rely on prevProps object comparison).
	let prevLayoutDependency: number | undefined = undefined;
	let prevIsPresent: boolean | undefined = undefined;
	watch.pre(
		[
			() => props._renderCount,
			() => props.layoutDependency,
			() => props.visualElement?.projection,
			() => props.isPresent,
		],
		() => {
			const { layoutDependency, visualElement, drag, isPresent } = props;
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
				drag ||
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
				} else if (!projection.relegate()) {
					frame.postRender(() => {
						const stack = projection.getStack();
						if (!stack || !stack.members.length) {
							safeToRemove();
						}
					});
				}
			}

			// When transitioning to not-present, keep prevLayoutDependency as undefined
			// so subsequent renders during exit animation always call willUpdate(), never safeToRemove().
			// This matches the original "recreate on every render" behavior where prevLayoutDependency
			// was always undefined (fresh component instance each time).
			prevLayoutDependency = isPresent ? layoutDependency : undefined;
			prevIsPresent = isPresent;
		},
	);

	// snapshotTrigger is bumped (via flushSync) BEFORE DOM removal so siblings snapshot
	// their positions while the exiting element is still in the DOM. It fires watch.pre
	// only (not $effect), so update()/didUpdate() are NOT called prematurely.
	// The main watch.pre above uses _renderCount which won't re-run for snapshotTrigger
	// changes, so we need a separate watcher.
	watch.pre([() => props.snapshotTrigger], ([snapshotTrigger], [prevST]) => {
		if (prevST === snapshotTrigger) return;
		const projection = props.visualElement?.projection;
		if (projection) {
			projection.willUpdate();
		}
	});

	// componentDidUpdate — re-runs on every render (via _renderCount) and on layoutDependency
	// or projection changes. Calls didUpdate() to trigger FLIP and schedules safeToRemove check.
	$effect(() => {
		void props._renderCount;
		void props.layoutDependency;
		if (props.visualElement?.projection) {
			const { projection } = props.visualElement;
			projection.root!.didUpdate();

			microtask.postRender(() => {
				if (!projection.currentAnimation && projection.isLead()) {
					safeToRemove();
				}
			});
		}
	});

	// component will unmount
	onDestroy(() => {
		const {
			visualElement,
			layoutGroup,
			switchLayoutGroup: promoteContext,
		} = props;
		if (visualElement?.projection) {
			const { projection } = visualElement;
			projection.scheduleCheckAfterUnmount();
			if (layoutGroup && layoutGroup.group)
				layoutGroup.group.remove(projection);
			if (promoteContext && promoteContext.deregister)
				promoteContext.deregister(projection);
		}
	});
</script>
