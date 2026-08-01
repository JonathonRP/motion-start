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
let isDestroyed = false;
const safeToRemove = () => {
	if (!isDestroyed) props.safeToRemove?.();
};

/**
 * Framer-motion runs `getSnapshotBeforeUpdate` on every render of the motion
 * component, so any prop that can change layout — `style`, `class`, and so on —
 * gets a pre-commit measurement for free. A Svelte effect only re-runs for the
 * sources it actually reads, so tracking `layoutDependency` alone means a plain
 * `layout` element that resizes itself (e.g. via `style`) never snapshots and
 * therefore snaps instead of animating. Spreading `props` reads every prop and
 * yields a fresh object identity per commit, which is the closest analogue to
 * "this component re-rendered".
 */
const renderSnapshot = $derived.by(() => ({ ...props }));

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
			if (!isDestroyed && visualElement?.projection === projection) {
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

let hasCompletedInitialPrepass = false;
let isProjectionFlushPending = false;

function scheduleProjectionFlush() {
	if (isDestroyed || isProjectionFlushPending) return;
	isProjectionFlushPending = true;

	tick().then(() => {
		isProjectionFlushPending = false;
		if (isDestroyed) return;

		const { visualElement, measurePop } = props;
		const projection = visualElement?.projection;
		if (!projection) return;

		if (measurePop) {
			measurePop(visualElement.current as HTMLElement | SVGElement);
		}
		projection.root!.didUpdate();
		microtask.postRender(() => {
			if (!isDestroyed && !projection.currentAnimation && projection.isLead()) {
				safeToRemove();
			}
		});
	});
}

// Pre-commit snapshot phase. This is the Svelte analogue of
// getSnapshotBeforeUpdate in framer-motion's MeasureLayout.
watch.pre(
	[
		() => renderSnapshot,
		() => props.layoutDependency,
		() => props.ambientLayoutDependency,
		() => props.drag,
		() => props.visualElement?.projection,
		() => props.isPresent,
	],
	(_currentValues, [, prevLayoutDependency, prevAmbientLayoutDependency, , , prevIsPresent]) => {
		const { layoutDependency, ambientLayoutDependency, visualElement, isPresent } = props;
		const projection = visualElement?.projection;
		const shouldSnapshot =
			props.drag ||
			prevLayoutDependency !== layoutDependency ||
			prevAmbientLayoutDependency !== ambientLayoutDependency ||
			layoutDependency === undefined;

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

		scheduleProjectionFlush();
	}
);

onDestroy(() => {
	isDestroyed = true;
	isProjectionFlushPending = false;

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
