/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionComponentConfig } from '../../motion';
import type { HTMLRenderState } from './types';
import { createHtmlRenderState } from './utils/create-render-state.js';
import { scrapeMotionValuesFromProps } from './utils/scrape-motion-values.js';

export const htmlMotionConfig: Partial<MotionComponentConfig<HTMLElement, HTMLRenderState>> = {
	scrapeMotionValuesFromProps,
	createRenderState: createHtmlRenderState,
} satisfies Partial<MotionComponentConfig<HTMLElement, HTMLRenderState>>;
