/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { makeUseVisualState } from '../../motion/utils/use-visual-state.svelte.js';
import { createBox } from '../../projection/geometry/models.js';
import type { ResolvedValues } from '../../render/types.js';
import { VisualElement } from '../../render/VisualElement.svelte.js';
import type { TargetAndTransition } from '../../types.js';
import { animateVisualElement } from '../interfaces/visual-element.js';

interface AnimatedStateOptions {
	initialState: ResolvedValues;
}

const createObject = () => ({});

class StateVisualElement extends VisualElement<ResolvedValues, Record<string, never>, AnimatedStateOptions> {
	type = 'state';
	build() {
		// State visual elements have no render target.
	}
	measureInstanceViewportBox = createBox;
	resetTransform() {
		// State visual elements have no transform to reset.
	}
	restoreTransform() {
		// State visual elements have no transform to restore.
	}
	removeValueFromRenderState() {
		// State visual elements don't maintain a render state.
	}
	renderInstance() {
		// State visual elements publish updates through onUpdate.
	}
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
export function useAnimatedState(initialState: ResolvedValues) {
	let animationState = $state<ResolvedValues>({ ...initialState });
	const visualState = useVisualState(
		() => ({}),
		() => false
	);

	const element = $state(
		new StateVisualElement(
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
		)
	);

	$effect(() => {
		element.mount({});
		return () => element.unmount();
	});

	const startAnimation = (animationDefinition: TargetAndTransition) => {
		return animateVisualElement(element, animationDefinition);
	};

	return () => [animationState, startAnimation] as const;
}
