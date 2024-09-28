/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { RenderComponent } from '../../motion/features/types';
import type { HTMLRenderState } from '../html/types';
import type { SVGRenderState } from '../svg/types';
import UseRender from './UseRender.svelte';

export function createUseRender(
	forwardMotionProps?: boolean
): RenderComponent<SVGElement, SVGRenderState> | RenderComponent<HTMLElement, HTMLRenderState> {
	return UseRender({ props: { forwardMotionProps } });
}

export { default as UseRender } from './UseRender.svelte';
