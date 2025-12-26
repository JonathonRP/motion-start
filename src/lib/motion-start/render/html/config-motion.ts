/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import type { MotionComponentConfig } from '../../motion';
import type { HTMLRenderState } from './types';
// export declare const htmlMotionConfig: ;

/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import { createHtmlRenderState } from './utils/create-render-state.js';
import { scrapeMotionValuesFromProps } from './utils/scrape-motion-values.js';

var htmlMotionConfig = {
	//@ts-expect-error
	scrapeMotionValuesFromProps: scrapeMotionValuesFromProps,
	createRenderState: createHtmlRenderState,
} satisfies Partial<MotionComponentConfig<HTMLElement, HTMLRenderState>>;

export { htmlMotionConfig };
