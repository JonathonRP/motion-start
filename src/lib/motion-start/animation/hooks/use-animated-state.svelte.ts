/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { onMount, tick } from 'svelte';
import type { TargetAndTransition } from '../../types';
import type { ResolvedValues } from '../../render/types';
import { makeUseVisualState } from '../../motion/utils/use-visual-state';
import { createBox } from '../../projection/geometry/models';
import { VisualElement } from '../../render/VisualElement';
import { animateVisualElement } from '../interfaces/visual-element';

interface AnimatedStateOptions {
	initialState: ResolvedValues;
}

const createObject = () => ({});

class StateVisualElement extends VisualElement<ResolvedValues, {}, AnimatedStateOptions> {
	type = 'state';
	build() {}
	measureInstanceViewportBox = createBox;
	resetTransform() {}
	restoreTransform() {}
	removeValueFromRenderState() {}
	renderInstance() {}
	scrapeMotionValuesFromProps() {
		return createObject();
	}
	getBaseTargetFromProps() {
		return undefined;
	}

	readValueFromInstance(_state: ResolvedValues, key: string, options: AnimatedStateOptions) {
		return options.initialState[key] || 0;
	}

	sortInstanceNodePosition() {
		return 0;
	}
}

const useVisualState = makeUseVisualState({
	scrapeMotionValuesFromProps: createObject,
	createRenderState: createObject,
});

/**
 * This is not an officially supported API and may be removed
 * on any version.
 */
export function useAnimatedState(initialState: any) {
	let animationState = initialState;
	const visualState = useVisualState({}, false);

	let element = new StateVisualElement(
		{
			props: {
				onUpdate: (v) => {
					animationState = { ...v };
				},
			},
			visualState,
			presenceContext: null,
		},
		{ initialState }
	);

	tick().then(() => {
		element = new StateVisualElement(
			{
				props: {
					onUpdate: (v) => {
						animationState = { ...v };
					},
				},
				visualState,
				presenceContext: null,
			},
			{ initialState }
		);
	});

	$effect.pre(() => {
		element.mount({});
		return () => element.unmount();
	});

	const startAnimation = () => (animationDefinition: TargetAndTransition) => {
		return animateVisualElement(element, animationDefinition);
	};

	return [animationState, startAnimation];
}
