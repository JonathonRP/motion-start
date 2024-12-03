/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { CustomValueType, ValueTarget, SingleTarget } from '../types';
import { isKeyframesTarget } from '../animation/utils/is-keyframes-target';

export const isCustomValue = (v: any): v is CustomValueType => {
	return Boolean(v && typeof v === 'object' && v.mix && v.toValue);
};

export const resolveFinalValueInKeyframes = (v: ValueTarget): SingleTarget => {
	// TODO maybe throw if v.length - 1 is placeholder token?
	return isKeyframesTarget(v) ? v[v.length - 1] || 0 : v;
};
