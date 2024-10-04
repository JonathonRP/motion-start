/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { MotionComponentConfig } from '../../motion/index.js';
import type { MotionProps } from '../../motion/types.js';
/**
 * I'd rather the return type of `custom` to be implicit but this throws
 * incorrect relative paths in the exported types and API Extractor throws
 * a wobbly.
 *
 * @internal
 */
export type CustomDomComponent<Props extends Record<string, any>> = Component<
	(Props & MotionProps) | (SVGElement | HTMLElement)
>;
export interface CustomMotionComponentConfig {
	forwardMotionProps?: boolean;
}
export type CreateConfig = <Instance, RenderState, Props extends Record<string, any>>(
	Component: string | Component<Props>,
	config: CustomMotionComponentConfig
) => MotionComponentConfig<Instance, RenderState>;
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
import { isSVGComponent } from './utils/is-svg-component.js';
import M from './M.svelte';
import type { loadFeatures } from '../../motion/features/definitions.js';
import { createMotionClass } from './create-motion-class.js';

type MotionComponent<Element extends keyof SvelteHTMLElements> = Component<
	MotionProps & {
		children?: Snippet;
		class?: string;
		el?: SvelteHTMLElements[Element]['this'];
	} & Omit<SvelteHTMLElements[Element], 'style'>
>;
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
function createMotionProxy(features: Parameters<typeof loadFeatures>[0]): {
	[P in keyof SvelteHTMLElements]: MotionComponent<P>;
} {
	return new Proxy({} as ReturnType<typeof createMotionProxy>, {
		get(_target, key: string) {
			let type = false;
			if (key.toString().slice(0, 1) === key.toString().slice(0, 1).toLowerCase()) {
				type = isSVGComponent(key);
			}
			const Motion = createMotionClass(features);

			return new Proxy(M, {
				construct(target, args) {
					if (!args || !args[0]) {
						args.push({});
					}
					if (!args[0]?.props) {
						args[0].props = { ___tag: key, isSVG: type, Motion };
					} else {
						args[0].props.___tag = key;
						args[0].props.isSVG = type;
						args[0].props.Motion = Motion;
					}

					// @ts-expect-error
					return new target(...args);
				},
				// support svelte 5
				apply(target, _thisArg, args) {
					if (!args[1]) {
						args[1] = { ___tag: key, isSVG: type, Motion };
					} else {
						args[1].___tag = key;
						args[1].isSVG = type;
						args[1].Motion = Motion;
					}

					// @ts-expect-error
					return target(...args);
				},
			});
		},
	});
}

export { createMotionProxy };
