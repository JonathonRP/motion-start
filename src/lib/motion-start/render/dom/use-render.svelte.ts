/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { getContext, setContext, tick } from 'svelte';
import type { RenderComponent } from '../../motion/features/types';
import type { HTMLRenderState } from '../html/types';
import { useHTMLProps } from '../html/use-props.svelte';
import type { SVGRenderState } from '../svg/types';
import { useSvgProps } from '../svg/use-props.svelte';
import { filterProps } from './utils/filter-props';
import { isSVGComponent } from './utils/is-svg-component';
import { Children$ } from '../../components/AnimatePresence/utils';
import { PresenceContext } from '../../context/PresenceContext';
import { default as useRender } from './UseRender.svelte';

export function createUseRender(forwardMotionProps = false) {
	setContext('forwardMotionProps', forwardMotionProps);
	// const useRender: RenderComponent<HTMLElement | SVGElement, HTMLRenderState | SVGRenderState> = (
	// 	Component,
	// 	props,
	// 	ref,
	// 	{ latestValues },
	// 	isStatic
	// ) => {
	// 	let useVisualProps = isSVGComponent(Component) ? useSvgProps : useHTMLProps;

	// 	let visualProps = useVisualProps(props as any, latestValues, isStatic, Component);

	// 	let filteredProps = filterProps(props, typeof Component === 'string', forwardMotionProps);

	// 	let elementProps = { ...filteredProps, ...visualProps };

	// 	let element = document.createElement(Component);

	// 	Object.entries<any>(elementProps)
	// 		.filter(([key]) => !key.startsWith('$'))
	// 		.forEach(([key, val]) => {
	// 			element?.setAttribute(key, val);
	// 		});

	// 	typeof ref === 'function' ? ref(element) : (ref!.current = element);

	// 	// const presenceContext =
	// 	// 	getContext<ReturnType<typeof PresenceContext>>(PresenceContext) || PresenceContext(Component);

	// 	// presenceContext.update((val) => val?.register());
	// 	// Children$.update((children$) => [...children$, { key: (element.dataset.key = `ap-${id++}`) }]);
	// 	afterUpdate(() => {
	// 		useVisualProps = isSVGComponent(Component) ? useSvgProps : useHTMLProps;

	// 		visualProps = useVisualProps(props as any, latestValues, isStatic, Component);

	// 		filteredProps = filterProps(props, typeof Component === 'string', forwardMotionProps);

	// 		elementProps = { ...filteredProps, ...visualProps, ref };

	// 		element = document.createElement(Component);

	// 		Object.entries<any>(elementProps).forEach(([key, val]) => {
	// 			element?.setAttribute(key, val);
	// 		});

	// 		typeof ref === 'function' ? ref(element) : (ref!.current = element);
	// 		// Children$.update((children$) => [...children$, element]);
	// 	});

	// 	return element;
	// };
	return useRender;
}
