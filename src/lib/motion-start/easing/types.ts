/**
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 */

/**
 * An easing function that accepts a progress value between 0 and 1
 * and returns an eased progress value.
 *
 * @param progress - A value between 0 and 1 representing animation progress
 * @returns The eased progress value
 */
export type EasingFunction = (progress: number) => number;

/**
 * A higher-order function that transforms an easing function.
 * Used to create variations like reverse and mirror effects.
 *
 * @param easing - The easing function to modify
 * @returns A new modified easing function
 */
export type EasingModifier = (easing: EasingFunction) => EasingFunction;

/**
 * A tuple of four numbers representing cubic bezier control points.
 * Format: [x1, y1, x2, y2]
 *
 * @example
 * ```ts
 * const ease: BezierDefinition = [0.42, 0, 0.58, 1];
 * ```
 */
export type BezierDefinition = [number, number, number, number];

/**
 * Predefined easing function names.
 * These map to commonly used easing curves.
 */
export type EasingDefinition =
	| 'linear'
	| 'easeIn'
	| 'easeOut'
	| 'easeInOut'
	| 'circIn'
	| 'circOut'
	| 'circInOut'
	| 'backIn'
	| 'backOut'
	| 'backInOut'
	| 'anticipate';

/**
 * The main easing type that can be:
 * - A named easing function (e.g., "easeIn")
 * - An array of four numbers defining a cubic bezier curve
 * - A custom easing function
 *
 * @example
 * ```ts
 * // Named easing
 * const ease1: Easing = "easeInOut";
 *
 * // Cubic bezier array
 * const ease2: Easing = [0.42, 0, 0.58, 1];
 *
 * // Custom function
 * const ease3: Easing = (t) => t * t;
 * ```
 */
export type Easing = EasingDefinition | BezierDefinition | EasingFunction;
