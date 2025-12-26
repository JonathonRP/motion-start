/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import type { CustomValueType, SingleTarget, ValueTarget } from '../types';
// export declare const isCustomValue: (v: any) => v is CustomValueType;
// export declare const resolveFinalValueInKeyframes: (v: ValueTarget) => SingleTarget;

/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import { isKeyframesTarget } from '../animation/utils/is-keyframes-target.js';

var isCustomValue = (v: any): v is CustomValueType => Boolean(v && typeof v === 'object' && v.mix && v.toValue);
var resolveFinalValueInKeyframes = (v: ValueTarget): SingleTarget => {
	// TODO maybe throw if v.length - 1 is placeholder token?
	return isKeyframesTarget(v) ? v[v.length - 1] || 0 : v;
};

export { isCustomValue, resolveFinalValueInKeyframes };
