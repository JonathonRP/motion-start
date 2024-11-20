/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { tick } from 'svelte';
import type { MotionProps } from '../../motion/types';
import { copyRawValuesOnly } from '../html/use-props';
import type { ResolvedValues } from '../types';
import { buildSVGAttrs } from './utils/build-attrs';
import { createSvgRenderState } from './utils/create-render-state';
import { isSVGTag } from './utils/is-svg-tag';

export function useSvgProps(props: MotionProps, visualState: ResolvedValues, _isStatic: boolean, Component: string) {
	const memo = (_visualState: typeof visualState) => {
		const state = createSvgRenderState();

		buildSVGAttrs(state, _visualState, isSVGTag(Component), props.transformTemplate);

		return {
			...state.attrs,
			style: { ...state.style },
		};
	};
	let visualProps = memo(visualState);

	tick().then(() => (visualProps = memo(visualState)));

	if (props.style) {
		const rawStyles = {};
		copyRawValuesOnly(rawStyles, props.style as any, props);
		visualProps.style = { ...rawStyles, ...visualProps.style };
	}

	return visualProps;
}
