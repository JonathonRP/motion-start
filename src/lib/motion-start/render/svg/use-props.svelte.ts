/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { Snippet, Component } from 'svelte';
import type { MotionProps } from '../../motion/types.js';
import { copyRawValuesOnly } from '../html/use-props.svelte.js';
import type { ResolvedValues } from '../types.js';
import { buildSVGAttrs } from './utils/build-attrs.js';
import { createSvgRenderState } from './utils/create-render-state.js';
import { isSVGTag } from './utils/is-svg-tag.js';

export function useSvgProps(
	props: () => MotionProps,
	visualState: () => ResolvedValues,
	_isStatic: boolean,
	Component: string | Component<{ children: Snippet | Component }>
) {
	const visualProps = () => {
		const state = createSvgRenderState();

		buildSVGAttrs(state, visualState(), isSVGTag(Component), props().transformTemplate);

		return {
			...state.attrs,
			style: { ...state.style },
		};
	};

	if (props().style) {
		const rawStyles = {};
		copyRawValuesOnly(rawStyles, props().style as any, props());
		visualProps().style = { ...rawStyles, ...visualProps().style };
	}

	return visualProps;
}
