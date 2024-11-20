/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { tick } from 'svelte';
import type { RenderComponent } from '../../motion/features/types';
import type { HTMLRenderState } from '../html/types';
import { useHTMLProps } from '../html/use-props';
import type { SVGRenderState } from '../svg/types';
import { useSvgProps } from '../svg/use-props';
import { filterProps } from './utils/filter-props';
import { isSVGComponent } from './utils/is-svg-component';

export function createUseRender(forwardMotionProps = false) {
	const useRender: RenderComponent<HTMLElement | SVGElement, HTMLRenderState | SVGRenderState> = (
		Component,
		props,
		ref,
		{ latestValues },
		isStatic
	) => {
		let useVisualProps = isSVGComponent(Component) ? useSvgProps : useHTMLProps;

		let visualProps = useVisualProps(props as any, latestValues, isStatic, Component);

		let filteredProps = filterProps(props, typeof Component === 'string', forwardMotionProps);

		let elementProps = { ...filteredProps, ...visualProps, ref };

		let element = ref(document.createElement(Component))?.current;

		Object.entries<any>(elementProps).forEach(([key, val]) => {
			element?.setAttribute(key, val);
		});

		tick().then(() => {
			useVisualProps = isSVGComponent(Component) ? useSvgProps : useHTMLProps;

			visualProps = useVisualProps(props as any, latestValues, isStatic, Component);

			filteredProps = filterProps(props, typeof Component === 'string', forwardMotionProps);

			elementProps = { ...filteredProps, ...visualProps, ref };

			element = ref(document.createElement(Component))?.current;

			Object.entries<any>(elementProps).forEach(([key, val]) => {
				element?.setAttribute(key, val);
			});
		});

		return element;
	};
	return useRender;
}
