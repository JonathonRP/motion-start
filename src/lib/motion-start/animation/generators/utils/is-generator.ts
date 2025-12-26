/**
 * Generator Type Guard
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Type guard utility for checking if a value is a generator factory function.
 */

import type { KeyframeGenerator } from '../types.js';

/**
 * Generator factory function type
 *
 * A function that creates a KeyframeGenerator from options
 */
export type GeneratorFactory = (options: any) => KeyframeGenerator<any>;

/**
 * Animation generator type definition
 *
 * Can be either:
 * - A generator factory function
 * - A string identifier for built-in generators
 */
export type AnimationGeneratorType =
	| GeneratorFactory
	| 'decay'
	| 'spring'
	| 'keyframes'
	| 'tween'
	| 'inertia';

/**
 * Type guard to check if a value is a generator factory function
 *
 * @param type - Value to check
 * @returns True if the value is a function (GeneratorFactory)
 *
 * @example
 * ```ts
 * if (isGenerator(animationType)) {
 *   // animationType is GeneratorFactory
 *   const gen = animationType(options);
 * } else {
 *   // animationType is a string like "spring" or "keyframes"
 *   const gen = getBuiltInGenerator(animationType, options);
 * }
 * ```
 */
export function isGenerator(type?: AnimationGeneratorType): type is GeneratorFactory {
	return typeof type === 'function';
}
