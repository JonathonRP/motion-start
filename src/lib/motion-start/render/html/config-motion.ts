/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionComponentConfig } from '../../motion/index.svelte';
import { makeUseVisualState } from '../../motion/utils/use-visual-state.svelte';
import type { HTMLRenderState } from './types';
import { createHtmlRenderState } from './utils/create-render-state.js';
import { scrapeMotionValuesFromProps } from './utils/scrape-motion-values.svelte.js';

export const htmlMotionConfig: Partial<MotionComponentConfig<HTMLElement, HTMLRenderState>> = {
	useVisualState: makeUseVisualState({
		scrapeMotionValuesFromProps,
		createRenderState: createHtmlRenderState,
	}),
} satisfies Partial<MotionComponentConfig<HTMLElement, HTMLRenderState>>;
