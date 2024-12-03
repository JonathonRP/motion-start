/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionProps } from '../types';

/**
 * A list of all valid MotionProps.
 *
 * @privateRemarks
 * This doesn't throw if a `MotionProp` name is missing - it should.
 */
const validMotionProps = new Set<keyof MotionProps>([
	'animate',
	'exit',
	'variants',
	'initial',
	'style',
	'values',
	'variants',
	'transition',
	'transformTemplate',
	'custom',
	'inherit',
	'onBeforeLayoutMeasure',
	'onAnimationStart',
	'onAnimationComplete',
	'onUpdate',
	'onDragStart',
	'onDrag',
	'onDragEnd',
	'onMeasureDragConstraints',
	'onDirectionLock',
	'onDragTransitionEnd',
	'_dragX',
	'_dragY',
	'onHoverStart',
	'onHoverEnd',
	'onViewportEnter',
	'onViewportLeave',
	'globalTapTarget',
	'ignoreStrict',
	'viewport',
]);

/**
 * Check whether a prop name is a valid `MotionProp` key.
 *
 * @param key - Name of the property to check
 * @returns `true` is key is a valid `MotionProp`.
 *
 * @public
 */
export function isValidMotionProp(key: string) {
	return (
		key.startsWith('while') ||
		(key.startsWith('drag') && key !== 'draggable') ||
		key.startsWith('layout') ||
		key.startsWith('onTap') ||
		key.startsWith('onPan') ||
		key.startsWith('onLayout') ||
		validMotionProps.has(key as keyof MotionProps)
	);
}
