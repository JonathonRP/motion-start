/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { MotionComponentConfig } from "../../motion";
import type { HTMLRenderState } from "./types";
// export declare const htmlMotionConfig: ;


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { scrapeMotionValuesFromProps } from './utils/scrape-motion-values.js';
import { createHtmlRenderState } from './utils/create-render-state.js';

var htmlMotionConfig = {
        scrapeMotionValuesFromProps: scrapeMotionValuesFromProps,
        createRenderState: createHtmlRenderState,   
} as Partial<MotionComponentConfig<HTMLElement, HTMLRenderState>>;

export { htmlMotionConfig };
