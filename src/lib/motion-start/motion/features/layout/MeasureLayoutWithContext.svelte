<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
import { watch } from 'runed';
import { onDestroy, onMount, tick } from 'svelte';
import { frame } from '../../../frameloop/index.js';
import { microtask } from '../../../frameloop/microtask.js';
import { globalProjectionState } from '../../../projection/node/state.js';
import { correctBorderRadius } from '../../../projection/styles/scale-border-radius.js';
import { correctBoxShadow } from '../../../projection/styles/scale-box-shadow.js';
import { addScaleCorrector } from '../../../projection/styles/scale-correction.js';
import type { MeasureProps } from './MeasureLayout.svelte';

const defaultScaleCorrectors = {
	borderRadius: {
		...correctBorderRadius,
		applyTo: ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'],
	},
	borderTopLeftRadius: correctBorderRadius,
	borderTopRightRadius: correctBorderRadius,
	borderBottomLeftRadius: correctBorderRadius,
	borderBottomRightRadius: correctBorderRadius,
	boxShadow: correctBoxShadow,
};

const props: MeasureProps = $props();
const safeToRemove = () => props.safeToRemove?.();

onMount(() => {
	const { visualElement, layoutGroup, switchLayoutGroup, layoutId } = props;
	const { projection } = visualElement;

	addScaleCorrector(defaultScaleCorrectors);

	if (projection) {
		if (layoutGroup.group) layoutGroup.group.add(projection);

		if (switchLayoutGroup && switchLayoutGroup.register && layoutId) {
			switchLayoutGroup.register(projection);
		}

		if (projection.options.layout || projection.options.layoutId) {
			projection.isLayoutDirty = true;
			if (!projection.root!.isUpdating) {
				projection.root!.startUpdate();
			}
		}

		tick().then(() => {
			if (visualElement?.projection === projection) {
				projection.root!.didUpdate();
			}
		});
		projection.addEventListener('animationComplete', () => {
			safeToRemove();
		});
		projection.setOptions({
			...projection.options,
			onExitComplete: () => safeToRemove(),
		});
	}

	globalProjectionState.hasEverUpdated = true;
});

// Incremented for every relevant wrapper update so the post-commit
// projection flush mirrors Framer's componentDidUpdate lifecycle.
let updateVersion = $state(0);
let hasCompletedInitialPrepass = false;

// Pre-commit snapshot phase. This is the Svelte analogue of
// getSnapshotBeforeUpdate in framer-motion's MeasureLayout.
watch.pre(
	[() => props.layoutDependency, () => props.drag, () => props.visualElement?.projection, () => props.isPresent],
	([], [prevLayoutDependency, , , prevIsPresent]) => {
		const { layoutDependency, visualElement, isPresent } = props;
		const projection = visualElement?.projection;
		const shouldSnapshot = props.drag || prevLayoutDependency !== layoutDependency || layoutDependency === undefined;

		if (!projection) {
			if (prevIsPresent !== isPresent && !isPresent) {
				safeToRemove();
			}
			prevIsPresent = isPresent;
			return;
		}

		projection.isPresent = isPresent;

		if (!hasCompletedInitialPrepass) {
			hasCompletedInitialPrepass = true;
			return;
		}

		if (shouldSnapshot) {
			projection.willUpdate();
		} else if (prevIsPresent === isPresent) {
			safeToRemove();
		}

		if (prevIsPresent !== isPresent) {
			if (isPresent) {
				projection.promote();
			} else {
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

		updateVersion++;
	}
);

// Post-commit projection flush. Runs after the relevant pre-pass so
// projection.root.didUpdate() sees the committed DOM.
watch([() => updateVersion, () => props.visualElement?.projection], () => {
	const { measurePop } = props;
	const { visualElement } = props;

	tick().then(() => {
		if (!updateVersion || !visualElement?.projection) return;

		const { projection } = visualElement;
		if (measurePop) {
			measurePop(visualElement.current as HTMLElement | SVGElement);
		}
		projection.root!.didUpdate();
		microtask.postRender(() => {
			if (!projection.currentAnimation && projection.isLead()) {
				safeToRemove();
			}
		});
	});
});

onDestroy(() => {
	const { visualElement, layoutGroup, switchLayoutGroup } = props;
	if (visualElement?.projection) {
		const { projection } = visualElement;

		if (projection.options.layoutId) {
			projection.willUpdate();
		}

		projection.scheduleCheckAfterUnmount();
		if (layoutGroup && layoutGroup.group) layoutGroup.group.remove(projection);
		if (switchLayoutGroup && switchLayoutGroup.deregister) switchLayoutGroup.deregister(projection);
	}
});
</script>
