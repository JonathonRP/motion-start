/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { correctBorderRadius } from '../../../projection/styles/scale-border-radius';
import { correctBoxShadow } from '../../../projection/styles/scale-box-shadow';
import { frame } from '../../../frameloop';
import { onMount, type Component, type ComponentProps } from 'svelte';
import { addScaleCorrector } from '../../../projection/styles/scale-correction';
import { globalProjectionState } from '../../../projection/node/state';
import { microtask } from '../../../frameloop/microtask';
import type { MeasureProps } from './MeasureLayout.svelte';
import { Previous } from 'runed';

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

interface Props extends MeasureProps {}

const MeasureLayoutWithContext: Component<Props> = (
	anchor,
	{ visualElement, layoutGroup, switchLayoutGroup, layoutId, layoutDependency, drag, isPresent, safeToRemove }: Props
) => {
	const { projection } = $derived(visualElement);
	$inspect(visualElement);
	$inspect(projection);

	const prevProps = new Previous(() => ({ isPresent, layoutDependency }));

	const _safeToRemove = () => {
		safeToRemove && safeToRemove();
	};

	// componentDidMount
	onMount(() => {
		addScaleCorrector(defaultScaleCorrectors);

		if (projection) {
			if (layoutGroup.group) layoutGroup.group.add(projection);

			if (switchLayoutGroup && switchLayoutGroup.register && layoutId) {
				switchLayoutGroup.register(projection);
			}

			projection.root!.didUpdate();
			projection.addEventListener('animationComplete', () => {
				_safeToRemove();
			});
			projection.setOptions({
				...projection.options,
				onExitComplete: () => _safeToRemove(),
			});
		}

		globalProjectionState.hasEverUpdated = true;

		return () => {
			// component will unmount
			if (projection) {
				projection.scheduleCheckAfterUnmount();
				if (layoutGroup && layoutGroup.group) layoutGroup.group.remove(projection);
				if (switchLayoutGroup && switchLayoutGroup.deregister) switchLayoutGroup.deregister(projection);
			}
		};
	});

	// getSnapshotBeforeUpdate
	$effect.pre(() => {
		if (!projection) return;

		/**
		 * TODO: We use this data in relegate to determine whether to
		 * promote a previous element. There's no guarantee its presence data
		 * will have updated by this point - if a bug like this arises it will
		 * have to be that we markForRelegation and then find a new lead some other way,
		 * perhaps in didUpdate
		 */
		projection.isPresent = isPresent;

		if (drag || prevProps.current?.layoutDependency !== layoutDependency || layoutDependency === undefined) {
			projection.willUpdate();
		} else {
			_safeToRemove();
		}

		if (prevProps.current?.isPresent !== isPresent) {
			if (isPresent) {
				projection.promote();
			} else if (!projection.relegate()) {
				/**
				 * If there's another stack member taking over from this one,
				 * it's in charge of the exit animation and therefore should
				 * be in charge of the safe to remove. Otherwise we call it here.
				 */
				frame.postRender(() => {
					const stack = projection.getStack();
					if (!stack || !stack.members.length) {
						_safeToRemove();
					}
				});
			}
		}
	});

	// componentDidUupdate
	$effect(() => {
		$inspect.trace();
		$inspect(projection);

		if (projection) {
			projection.root!.didUpdate();

			microtask.postRender(() => {
				if (!projection.currentAnimation && projection.isLead()) {
					_safeToRemove();
				}
			});
		}
	});
};

export default MeasureLayoutWithContext;
