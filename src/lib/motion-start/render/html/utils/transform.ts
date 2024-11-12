/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

/**
 * Generate a list of every possible transform key.
 */
export const transformPropOrder = [
	'transformPerspective',
	'x',
	'y',
	'z',
	'translateX',
	'translateY',
	'translateZ',
	'scale',
	'scaleX',
	'scaleY',
	'rotate',
	'rotateX',
	'rotateY',
	'rotateZ',
	'skew',
	'skewX',
	'skewY',
];

/**
 * A quick lookup for transform props.
 */
export const transformProps = new Set(transformPropOrder);
