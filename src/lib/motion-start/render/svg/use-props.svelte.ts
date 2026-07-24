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
		const rawStyles: ResolvedValues = {};

		buildSVGAttrs(state, visualState(), isSVGTag(Component), props().transformTemplate);
		if (props().style) {
			copyRawValuesOnly(rawStyles, props().style as any, props());
		}

		return {
			...state.attrs,
			style: { ...rawStyles, ...state.style },
		};
	};

	return visualProps;
}
