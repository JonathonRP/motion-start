import type { Component } from 'svelte';
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

type MotionProxy = typeof createMotionComponent &
	DOMMotionComponents & {
		create: typeof createMotionComponent;
	};

type CreateMotionComponent = typeof createMotionComponent;

/**
 * Convert any Svelte component into a `motion` component. The provided component
 * **must** spread `{...restProps}` onto its root DOM element so that the motion
 * attachment can reach the underlying DOM node.
 *
 * @public
 */
export function createDOMMotionComponentProxy(componentFactory: CreateMotionComponent): MotionProxy {
	if (typeof Proxy === 'undefined') {
		return componentFactory as MotionProxy;
	}

	const componentCache = new Map<string, Component>();

	const deprecatedFactoryFunction = (...args: Parameters<CreateMotionComponent>): ReturnType<CreateMotionComponent> => {
		if (process.env.NODE_ENV !== 'production') {
			warnOnce(false, 'motion() is deprecated. Use motion.create() instead.');
		}
		return (componentFactory as (...a: Parameters<CreateMotionComponent>) => ReturnType<CreateMotionComponent>)(
			...args
		);
	};

	const proxy: MotionProxy = new Proxy(deprecatedFactoryFunction as MotionProxy, {
		get(_target, key) {
			if (typeof key !== 'string') {
				throw new Error(`motion.${String(key)} is not a valid motion component.`);
			}
			if (key === 'create') return componentFactory;

			// Cache and return HTML/SVG element motion components
			if (!componentCache.has(key)) {
				componentCache.set(key, componentFactory(key));
			}
			return componentCache.get(key);
		},
	});

	return proxy;
}
