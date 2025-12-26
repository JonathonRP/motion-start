/**
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 */

import { cubicBezier } from './cubic-bezier';

/**
 * Linear easing function - no acceleration or deceleration.
 *
 * Mathematical explanation: f(t) = t (identity function)
 *
 * Visual description: Constant speed throughout the animation.
 * The animation progresses at a steady, unchanging rate from start to finish.
 *
 * Dependencies: None
 *
 * @param t - Progress value (0-1)
 * @returns Same progress value (0-1)
 *
 * @example
 * ```ts
 * linear(0) // 0
 * linear(0.5) // 0.5
 * linear(1) // 1
 * ```
 */
export const linear = (t: number): number => t;

/**
 * Ease in - slow start, accelerating to fast end.
 *
 * Mathematical explanation: Cubic bezier with control points (0.42, 0, 1, 1)
 * Creates an acceleration curve that starts slowly and speeds up.
 *
 * Visual description: Smooth acceleration from a slow start.
 * The animation begins gently and progressively speeds up, like a car
 * accelerating from a standstill.
 *
 * Dependencies: cubicBezier
 *
 * @example
 * ```ts
 * easeIn(0) // 0 (starts slow)
 * easeIn(0.5) // ~0.16 (still accelerating)
 * easeIn(1) // 1 (fast finish)
 * ```
 */
export const easeIn = /*@__PURE__*/ cubicBezier(0.42, 0, 1, 1);

/**
 * Ease out - fast start, decelerating to slow end.
 *
 * Mathematical explanation: Cubic bezier with control points (0, 0, 0.58, 1)
 * Creates a deceleration curve that starts fast and slows down.
 *
 * Visual description: Smooth deceleration to a gentle stop.
 * The animation begins quickly and progressively slows down, like a car
 * braking smoothly to a stop.
 *
 * Dependencies: cubicBezier
 *
 * @example
 * ```ts
 * easeOut(0) // 0 (fast start)
 * easeOut(0.5) // ~0.84 (already decelerating)
 * easeOut(1) // 1 (gentle stop)
 * ```
 */
export const easeOut = /*@__PURE__*/ cubicBezier(0, 0, 0.58, 1);

/**
 * Ease in-out - slow start and end, fast middle.
 *
 * Mathematical explanation: Cubic bezier with control points (0.42, 0, 0.58, 1)
 * Combines acceleration and deceleration for a smooth S-curve.
 *
 * Visual description: Smooth acceleration then deceleration.
 * The animation starts slowly, speeds up in the middle, then slows down
 * again at the end. Creates a natural, organic motion.
 *
 * Dependencies: cubicBezier
 *
 * @example
 * ```ts
 * easeInOut(0) // 0 (slow start)
 * easeInOut(0.5) // 0.5 (fastest point)
 * easeInOut(1) // 1 (slow end)
 * ```
 */
export const easeInOut = /*@__PURE__*/ cubicBezier(0.42, 0, 0.58, 1);
