/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionProps } from '../../motion/types';
import type { TargetAndTransition, TargetResolver } from '../../types';
import type { VisualElement } from '../VisualElement';
import type { ResolvedValues } from '../types';

function getValueState<I>(visualElement?: VisualElement<I>): [ResolvedValues, ResolvedValues] {
	const state: [ResolvedValues, ResolvedValues] = [{}, {}];

	visualElement?.values.forEach((value, key) => {
		state[0][key] = value.get();
		state[1][key] = value.getVelocity();
	});

	return state;
}

export function resolveVariantFromProps<I>(
	props: MotionProps,
	definition: TargetAndTransition | TargetResolver,
	custom?: any,
	visualElement?: VisualElement<I>
): TargetAndTransition;
export function resolveVariantFromProps<I>(
	props: MotionProps,
	definition?: string | TargetAndTransition | TargetResolver,
	custom?: any,
	visualElement?: VisualElement<I>
): undefined | TargetAndTransition;
export function resolveVariantFromProps<I>(
	props: MotionProps,
	definition?: string | TargetAndTransition | TargetResolver,
	custom?: any,
	visualElement?: VisualElement<I>
) {
	/**
	 * If the variant definition is a function, resolve.
	 */
	if (typeof definition === 'function') {
		const [current, velocity] = getValueState(visualElement);
		definition = definition(custom !== undefined ? custom : props.custom, current, velocity);
	}

	/**
	 * If the variant definition is a variant label, or
	 * the function returned a variant label, resolve.
	 */
	if (typeof definition === 'string') {
		definition = props.variants && props.variants[definition];
	}

	/**
	 * At this point we've resolved both functions and variant labels,
	 * but the resolved variant label might itself have been a function.
	 * If so, resolve. This can only have returned a valid target object.
	 */
	if (typeof definition === 'function') {
		const [current, velocity] = getValueState(visualElement);
		definition = definition(custom !== undefined ? custom : props.custom, current, velocity);
	}

	return definition;
}