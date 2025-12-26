/**
 * Easing utilities for motion-start
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * This module provides utilities for converting easing definitions
 * (strings, arrays, or functions) into easing functions.
 */

import type { Easing, EasingFunction } from '../../types';
import {
	anticipate,
	backIn,
	backInOut,
	backOut,
	circIn,
	circInOut,
	circOut,
	cubicBezier,
	easeIn,
	easeInOut,
	easeOut,
	linear,
	easingLookup as internalEasingLookup,
} from '../../easing';

/**
 * Lookup map for easing functions.
 * Maps easing names to their function implementations.
 *
 * Note: bounceIn, bounceInOut, bounceOut are maintained from the original
 * popmotion import for backward compatibility, but are not part of the
 * core framer-motion v11.11.11 easing library.
 */
const easingLookup: Record<string, EasingFunction> = {
	...internalEasingLookup,
	// Note: Bounce easing functions are not part of framer-motion v11.11.11
	// but are kept here for backward compatibility if needed from popmotion
	// bounceIn: bounceIn,
	// bounceInOut: bounceInOut,
	// bounceOut: bounceOut,
};

/**
 * Converts an easing definition to an easing function.
 *
 * The definition can be:
 * 1. A string name (e.g., "easeIn", "easeOut", "anticipate")
 * 2. An array of 4 numbers defining a cubic bezier curve [x1, y1, x2, y2]
 * 3. A custom easing function that accepts and returns a value 0-1
 *
 * @param definition - The easing definition to convert
 * @returns An easing function that accepts progress (0-1) and returns eased value
 *
 * @example
 * ```ts
 * // From string
 * const ease1 = easingDefinitionToFunction("easeInOut");
 *
 * // From cubic bezier array
 * const ease2 = easingDefinitionToFunction([0.42, 0, 0.58, 1]);
 *
 * // Custom function (returned as-is)
 * const ease3 = easingDefinitionToFunction((t) => t * t);
 * ```
 */
export const easingDefinitionToFunction = (definition: Easing): EasingFunction => {
	if (Array.isArray(definition)) {
		// If cubic bezier definition, create bezier curve
		const [x1, y1, x2, y2] = definition;
		return cubicBezier(x1, y1, x2, y2);
	} else if (typeof definition === 'string') {
		// Else lookup from table
		return easingLookup[definition];
	}
	// Already a function, return as-is
	return definition;
};

/**
 * Type guard to check if a value is an array of easing definitions.
 *
 * This is useful when you want to apply different easing to different
 * properties or keyframes.
 *
 * @param ease - The value to check
 * @returns True if the value is an array of easing definitions
 *
 * @example
 * ```ts
 * const singleEasing = "easeIn";
 * const multipleEasings = ["easeIn", "easeOut", [0.42, 0, 0.58, 1]];
 *
 * isEasingArray(singleEasing) // false
 * isEasingArray(multipleEasings) // true
 * ```
 */
export const isEasingArray = (ease: Easing[] | any): ease is Easing[] => {
	return Array.isArray(ease) && typeof ease[0] !== 'number';
};

// Re-export all easing functions for convenience
export {
	linear,
	easeIn,
	easeOut,
	easeInOut,
	circIn,
	circOut,
	circInOut,
	backIn,
	backOut,
	backInOut,
	anticipate,
	cubicBezier,
};
