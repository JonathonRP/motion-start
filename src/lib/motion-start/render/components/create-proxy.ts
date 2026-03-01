import type { Component, Snippet } from 'svelte';
import type { SvelteHTMLElements } from 'svelte/elements';
import type { MotionProps } from '../../motion/types.js';
import { warnOnce } from '../../utils/warn-once';
import type { DOMMotionComponents } from '../dom/types.js';
import type { createMotionComponent } from './motion/create';

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

// type MotionComponent<Element extends keyof SvelteHTMLElements> = Component<
// 	MotionProps & {
// 		children?: Snippet;
// 		class?: string;
// 		this?: SvelteHTMLElements[Element]['this'];
// 	} & Omit<SvelteHTMLElements[Element], 'style'>
// >;

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
export function createDOMMotionComponentProxy<Props>(componentFactory: typeof createMotionComponent): {
	[K in keyof DOMMotionComponents]: DOMMotionComponents[K];
} & {
	create: typeof componentFactory;
} & typeof componentFactory {
	type MotionProxy = { [K in keyof DOMMotionComponents]: DOMMotionComponents[K] } & {
		create: typeof componentFactory;
	} & typeof componentFactory;

	if (typeof Proxy === 'undefined') {
		return componentFactory as MotionProxy;
	}

	const deprecatedFactoryFunction: typeof createMotionComponent = (...args) => {
		if (process.env.NODE_ENV !== 'production') {
			warnOnce(false, 'motion() is deprecated. Use motion.create() instead.');
		}
		return componentFactory(...args);
	};

	return new Proxy(deprecatedFactoryFunction as ReturnType<typeof createDOMMotionComponentProxy>, {
		get(_target, key: string) {
			if (key === 'create') return componentFactory;
			return componentFactory<Props, typeof key>(key);
		},
	});
}
