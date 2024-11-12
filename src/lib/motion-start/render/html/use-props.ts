/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { isForcedMotionValue } from '../../motion/utils/is-forced-motion-value';
import type { MotionValue } from '../../value';
import { isMotionValue } from '../../value/utils/is-motion-value';
import type { MotionProps } from '../../motion/types';
import type { ResolvedValues } from '../types';

export function copyRawValuesOnly(
	target: ResolvedValues,
	source: { [key: string]: string | number | MotionValue },
	props: MotionProps
) {
	for (const key in source) {
		if (!isMotionValue(source[key]) && !isForcedMotionValue(key, props)) {
			target[key] = source[key] as string | number;
		}
	}
}

// export type UseStyle = (props: MotionProps, visualState: ResolvedValues, isStatic: boolean) => ResolvedValues;
// export type UseHTMLProps = (props: MotionProps, visualState: ResolvedValues, isStatic: boolean) => any;
// export { default as UseInitialMotionValues } from './UseInitialMotionValues.svelte';
// export { default as UseStyle } from './UseStyle.svelte';
export { default as UseHTMLProps } from './UseHTMLProps.svelte';
