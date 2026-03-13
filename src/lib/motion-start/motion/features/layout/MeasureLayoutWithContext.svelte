<!-- based on framer-motion@11.11.11,
 Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
	import { Previous, watch } from "runed";
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

	// getSnapshotBeforeUpdate
	watch.pre(
		[() => props, () => props.visualElement?.projection],
		([props], [prevProps]) => {
			const { layoutDependency, visualElement, drag, isPresent } =
				props ?? {};
			const projection = visualElement?.projection;

			if (!projection) {
				if (prevProps?.isPresent !== isPresent && !isPresent) {
					safeToRemove();
				}
				return;
			}

			/**
			 * TODO: We use this data in relegate to determine whether to
			 * promote a previous element. There's no guarantee its presence data
			 * will have updated by this point - if a bug like this arises it will
			 * have to be that we markForRelegation and then find a new lead some other way,
			 * perhaps in didUpdate
			 */
			projection.isPresent = isPresent;

			if (
				drag ||
				prevProps?.layoutDependency !== layoutDependency ||
				layoutDependency === undefined
			) {
				projection.willUpdate();
			} else {
				safeToRemove();
			}

			if (prevProps?.isPresent !== isPresent) {
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
		},
	);

	// componentDidUpdate
	$effect(() => {
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
