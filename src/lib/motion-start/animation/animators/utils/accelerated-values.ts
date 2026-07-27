/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

/**
 * A list of values that can be hardware-accelerated.
 */
export const acceleratedValues = new Set<string>([
	'opacity',
	'clipPath',
	'filter',
	'transform',
	// TODO: Can be accelerated but currently disabled until https://issues.chromium.org/issues/41491098 is resolved
	// or until we implement support for linear() easing.
	// "background-color"
]);
