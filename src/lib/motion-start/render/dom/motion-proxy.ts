/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { MotionComponentConfig } from "../../motion/index.js";
import type { MotionProps } from "../../motion/types.js";
/**
 * I'd rather the return type of `custom` to be implicit but this throws
 * incorrect relative paths in the exported types and API Extractor throws
 * a wobbly.
 *
 * @internal
 */
export type CustomDomComponent<Props> = React.ForwardRefExoticComponent<React.PropsWithoutRef<Props & MotionProps> & React.RefAttributes<SVGElement | HTMLElement>>;
export interface CustomMotionComponentConfig {
    forwardMotionProps?: boolean;
}
export type CreateConfig = <Instance, RenderState, Props>(Component: string | React.ComponentType<Props>, config: CustomMotionComponentConfig) => MotionComponentConfig<Instance, RenderState>;
/**
 * Convert any React component into a `motion` component. The provided component
 * **must** use `React.forwardRef` to the underlying DOM component you want to animate.
 *
 * ```jsx
 * const Component = React.forwardRef((props, ref) => {
 *   return <div ref={ref} />
 * })
 *
 * const MotionComponent = motion(Component)
 * ```
 *
 * @public
 */
// export declare function createMotionProxy(createConfig: CreateConfig): (<Props>(Component: string | React.ComponentType<Props>, customMotionComponentConfig?: CustomMotionComponentConfig) => CustomDomComponent<Props>) & import("../html/types").HTMLMotionComponents & import("../svg/types").SVGMotionComponents;


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import type { Component, Snippet } from 'svelte';
import type { SvelteHTMLElements } from 'svelte/elements';
import Mo from './M.svelte';
import { isSVGComponent } from './utils/is-svg-component.js';

type M<Element extends keyof SvelteHTMLElements> = MotionProps & {children: Snippet, class: string} & Omit<SvelteHTMLElements[Element], 'style'>;
type motion<Element extends keyof SvelteHTMLElements> = Component<M<Element>>;
/**
 * Convert any React component into a `motion` component. The provided component
 * **must** use `React.forwardRef` to the underlying DOM component you want to animate.
 *
 * ```jsx
 * const Component = React.forwardRef((props, ref) => {
 *   return <div ref={ref} />
 * })
 *
 * const MotionComponent = motion(Component)
 * ```
 *
 * @public
 */
function createMotionProxy(): { [P in keyof SvelteHTMLElements]: motion<P> } {
	return new Proxy(
		{},
		{
			get(_target, key: string) {
				let type = false;
				if (key.toString().slice(0, 1) === key.toString().slice(0, 1).toLowerCase()) {
					type = isSVGComponent(key);
				}

				return new Proxy(Mo, {
					construct(target, args) {
						if (!args || !args[0]) {
							args.push({});
						}
						if (!args[0]?.props) {
							args[0].props = { ___tag: key, isSVG: type };
						} else {
							args[0].props.___tag = key;
							args[0].props.isSVG = type;
						}

						console.log(target, args);

						//@ts-ignore
						return new target(...args);
					},
                    // support svelte 5
					apply(target, thisArg, args) {
						if (!args[1]) {
							args[1] = { ___tag: key, isSVG: type };
						} else {
							args[1].___tag = key;
							args[1].isSVG = type;
						}
						//@ts-ignore
						return target(...args);
					},
				});
			},
		}
	) as { [P in keyof SvelteHTMLElements]: motion<P> };
}

const M = createMotionProxy();

export { M, createMotionProxy };

