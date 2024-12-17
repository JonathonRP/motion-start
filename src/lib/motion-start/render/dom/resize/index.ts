/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { ElementOrSelector } from '../../../animation/types';
import { resizeElement } from './handle-element.svelte';
import { resizeWindow } from './handle-window.svelte';
import type { ResizeHandler } from './types';

export function resize(onResize: ResizeHandler<Window>): VoidFunction;
export function resize(target: ElementOrSelector, onResize: ResizeHandler<Element>): VoidFunction;
export function resize(a: ResizeHandler<Window> | ElementOrSelector, b?: ResizeHandler<Element>) {
	return typeof a === 'function' ? resizeWindow(a) : resizeElement(a, b!);
}
