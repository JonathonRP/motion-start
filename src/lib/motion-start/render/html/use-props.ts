/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { isForcedMotionValue } from '../../motion/utils/is-forced-motion-value.js';
import type { MotionValue } from '../../value/index.js';
import { isMotionValue } from '../../value/utils/is-motion-value.js';
import type { MotionProps } from '../../motion/types';
import type { ResolvedValues } from '../types';

export type UseStyle = (props: MotionProps, visualState: ResolvedValues, isStatic: boolean) => ResolvedValues;
export type UseHTMLProps = (props: MotionProps, visualState: ResolvedValues, isStatic: boolean) => any;

import { default as UseHTMLPropsComp } from './UseHTMLProps.svelte';
import { default as UseStyleComp } from './UseStyle.svelte';

export const UseHTMLProps = UseHTMLPropsComp as typeof UseHTMLPropsComp;
export const UseStyle = UseStyleComp as typeof UseStyleComp;

export function copyRawValuesOnly(
	target: ResolvedValues,
	source: {
		[key: string]: string | number | MotionValue;
	},
	props: MotionProps
) {
	for (const key in source) {
		if (!isMotionValue(source[key]) && !isForcedMotionValue(key, props)) {
			target[key] = source[key];
		}
	}
}
