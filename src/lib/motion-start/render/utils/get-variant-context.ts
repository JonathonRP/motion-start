/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { VisualElement } from '../VisualElement';
import { isVariantLabel } from './is-variant-label';
import { variantProps } from './variant-props';

const numVariantProps = variantProps.length;

export type VariantStateContext = {
	initial?: string | string[];
	animate?: string | string[];
	exit?: string | string[];
	whileHover?: string | string[];
	whileDrag?: string | string[];
	whileFocus?: string | string[];
	whileTap?: string | string[];
};

export function getVariantContext<I>(visualElement?: VisualElement<I>): undefined | VariantStateContext {
	if (!visualElement) return undefined;

	if (!visualElement.isControllingVariants) {
		const context = visualElement.parent ? getVariantContext(visualElement.parent) || {} : {};
		if (visualElement.props.initial !== undefined) {
			context.initial = visualElement.props.initial as any;
		}
		return context;
	}

	const context = {};
	for (let i = 0; i < numVariantProps; i++) {
		const name = variantProps[i] as keyof typeof context;
		const prop = visualElement.props[name];

		if (isVariantLabel(prop) || prop === false) {
			context[name] = prop;
		}
	}

	return context;
}
