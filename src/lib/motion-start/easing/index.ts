/**
 * Easing Library for motion-start
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Complete easing functions library for smooth, natural animations.
 * All functions accept a progress value (0-1) and return an eased value.
 */

// ============================================================================
// Types
// ============================================================================
export type {
	Easing,
	EasingDefinition,
	EasingFunction,
	EasingModifier,
	BezierDefinition,
} from './types';

export type { Direction } from './steps';

// ============================================================================
// Core Easing Functions
// ============================================================================

/**
 * Linear easing - constant speed, no acceleration or deceleration.
 */
export { linear } from './ease';

/**
 * Standard easing curves using cubic bezier:
 * - easeIn: Slow start, fast end
 * - easeOut: Fast start, slow end
 * - easeInOut: Slow start and end, fast middle
 */
export { easeIn, easeOut, easeInOut } from './ease';

// ============================================================================
// Back Easing (with overshoot)
// ============================================================================

/**
 * Back easing with overshoot effects:
 * - backIn: Pulls back before moving forward
 * - backOut: Overshoots target then settles
 * - backInOut: Combines both effects
 */
export { backIn, backOut, backInOut } from './back';

// ============================================================================
// Circular Easing
// ============================================================================

/**
 * Circular easing following circular arc curves:
 * - circIn: Gentle acceleration along circular arc
 * - circOut: Gentle deceleration along circular arc
 * - circInOut: Smooth acceleration and deceleration
 */
export { circIn, circOut, circInOut } from './circ';

// ============================================================================
// Special Easing Functions
// ============================================================================

/**
 * Anticipate - Dramatic pull-back then rapid acceleration.
 * Perfect for launch animations and attention-grabbing effects.
 */
export { anticipate } from './anticipate';

/**
 * Steps - Creates discrete stepped animations.
 * Perfect for sprite sheets and frame-based animations.
 */
export { steps } from './steps';

// ============================================================================
// Cubic Bezier Generator
// ============================================================================

/**
 * Create custom cubic bezier easing curves.
 * Provides full control over acceleration and deceleration.
 */
export { cubicBezier } from './cubic-bezier';

// ============================================================================
// Easing Modifiers
// ============================================================================

/**
 * Transform existing easing functions:
 * - reverseEasing: Flip easing direction (ease-in ↔ ease-out)
 * - mirrorEasing: Create bidirectional easing (ease-in → ease-in-out)
 */
export { reverseEasing } from './modifiers/reverse';
export { mirrorEasing } from './modifiers/mirror';

// ============================================================================
// Utilities
// ============================================================================

/**
 * Utility functions used internally:
 * - clamp: Constrain values to a range
 * - noop: Identity function for linear curves
 */
export { clamp } from './utils/clamp';
export { noop } from './utils/noop';

// ============================================================================
// Easing Lookup Map (for string-based easing names)
// ============================================================================

import type { EasingFunction } from './types';
import { linear, easeIn, easeOut, easeInOut } from './ease';
import { backIn, backOut, backInOut } from './back';
import { circIn, circOut, circInOut } from './circ';
import { anticipate } from './anticipate';

/**
 * Map of easing function names to their implementations.
 * Used for resolving string-based easing definitions.
 *
 * @example
 * ```ts
 * const easing = easingLookup["easeInOut"];
 * const value = easing(0.5); // 0.5
 * ```
 */
export const easingLookup: Record<string, EasingFunction> = {
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
};
