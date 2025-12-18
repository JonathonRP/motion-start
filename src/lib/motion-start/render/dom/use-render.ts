/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { RenderComponent } from '../../motion/features/types';
import type { HTMLRenderState } from '../html/types';
import type { SVGRenderState } from '../svg/types';
import UseRender from './UseRender.svelte';

export function createUseRender(forwardMotionProps = false) {
	// setContext('forwardMotionProps', forwardMotionProps);
	const useRender: RenderComponent<HTMLElement | SVGElement, HTMLRenderState | SVGRenderState> = (anchor, props) => {
		return UseRender(anchor, {
			get Component() {
				return props.Component;
			},
			get props() {
				return props.props;
			},
			get ref() {
				return props.ref;
			},
			get visualState() {
				return props.visualState;
			},
			get isStatic() {
				return props.isStatic;
			},
			get visualElement() {
				return props.visualElement;
			},
			get forwardMotionProps() {
				return forwardMotionProps;
			},
		});
	};
	return useRender;
}
