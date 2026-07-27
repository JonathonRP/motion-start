/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { DOMVisualElementOptions } from './types.js';
import { VisualElement } from '../VisualElement.svelte.js';
import type { MotionProps, MotionStyle } from '../../motion/types.js';
import type { MotionValue } from '../../value/index.js';
import type { HTMLRenderState } from '../html/types.js';
import { DOMKeyframesResolver } from './DOMKeyframesResolver.js';

export abstract class DOMVisualElement<
	Instance extends HTMLElement | SVGElement = HTMLElement,
	State extends HTMLRenderState = HTMLRenderState,
	Options extends DOMVisualElementOptions = DOMVisualElementOptions,
> extends VisualElement<Instance, State, Options> {
	sortInstanceNodePosition(a: Instance, b: Instance): number {
		/**
		 * compareDocumentPosition returns a bitmask, by using the bitwise &
		 * we're returning true if 2 in that bitmask is set to true. 2 is set
		 * to true if b preceeds a.
		 */
		return a.compareDocumentPosition(b) & 2 ? 1 : -1;
	}

	getBaseTargetFromProps(props: MotionProps, key: string): string | number | MotionValue<any> | undefined {
		return props.style ? (props.style[key as keyof MotionStyle] as string) : undefined;
	}

	removeValueFromRenderState(key: string, { vars, style }: HTMLRenderState): void {
		delete vars[key];
		delete style[key];
	}

	KeyframeResolver = DOMKeyframesResolver;
}
