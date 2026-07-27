/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { HTMLRenderState } from '../types.js';

export const createHtmlRenderState = (): HTMLRenderState =>
	({
		style: {},
		transform: {},
		transformOrigin: {},
		vars: {},
	}) as HTMLRenderState;
