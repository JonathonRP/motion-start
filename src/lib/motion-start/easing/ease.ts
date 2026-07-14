/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { cubicBezier } from './cubic-bezier';

export const easeIn = /*@__PURE__*/ cubicBezier(0.42, 0, 1, 1);
export const easeOut = /*@__PURE__*/ cubicBezier(0, 0, 0.58, 1);
export const easeInOut = /*@__PURE__*/ cubicBezier(0.42, 0, 0.58, 1);
