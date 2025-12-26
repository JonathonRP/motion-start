/**
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 */

import { mirrorEasing } from './modifiers/mirror';
import { reverseEasing } from './modifiers/reverse';
import type { EasingFunction } from './types';

/**
 * Circular ease in - follows a circular curve for smooth acceleration.
 *
 * Mathematical explanation:
 * Uses the equation: f(p) = 1 - sin(arccos(p))
 *
 * This is derived from the circular equation: x² + y² = 1
 * - For a quarter circle from (1,0) to (0,1)
 * - Solving for y: y = √(1 - x²)
 * - Inverted: 1 - sin(acos(p)) gives the same curve
 *
 * The curve follows the shape of a quarter circle, providing a gentler
 * acceleration than power functions but more pronounced than cubic bezier.
 *
 * Visual description:
 * Gentle start that smoothly accelerates along a circular arc.
 * The acceleration is more gradual than cubic easing, creating a very
 * smooth, organic motion. Starts very slowly and builds momentum gradually.
 * Like a ball rolling down a circular ramp - smooth and predictable.
 *
 * Common use cases:
 * - Subtle entrance animations
 * - Smooth scrolling effects
 * - Fade-in animations
 * - Elements appearing naturally
 *
 * Dependencies: None (uses built-in Math functions)
 *
 * @example
 * ```ts
 * circIn(0) // 0 (very slow start)
 * circIn(0.5) // ~0.134 (still accelerating)
 * circIn(0.9) // ~0.564 (rapid acceleration)
 * circIn(1) // 1 (full speed)
 * ```
 */
export const circIn: EasingFunction = (p) => 1 - Math.sin(Math.acos(p));

/**
 * Circular ease out - follows a circular curve for smooth deceleration.
 *
 * Mathematical explanation:
 * Created by reversing circIn: f(p) = 1 - (1 - sin(acos(1 - p)))
 * Simplified: f(p) = sin(acos(1 - p))
 *
 * Visual description:
 * Fast start that smoothly decelerates along a circular arc.
 * The deceleration is more gradual than cubic easing. Starts quickly
 * and gradually slows down in a very smooth, natural way. Like a ball
 * rolling up a circular ramp - smooth deceleration to a gentle stop.
 *
 * Common use cases:
 * - Exit animations
 * - Smooth scrolling to stop
 * - Fade-out animations
 * - Elements disappearing naturally
 *
 * Dependencies: circIn, reverseEasing
 *
 * @example
 * ```ts
 * circOut(0) // 0 (full speed start)
 * circOut(0.5) // ~0.866 (already decelerating)
 * circOut(0.9) // ~0.994 (almost stopped)
 * circOut(1) // 1 (gentle stop)
 * ```
 */
export const circOut = /*@__PURE__*/ reverseEasing(circIn);

/**
 * Circular ease in-out - circular acceleration and deceleration.
 *
 * Mathematical explanation:
 * Created by applying mirrorEasing to circIn, which creates a symmetrical
 * bidirectional version.
 * - First half: circIn from 0 to 0.5
 * - Second half: reflected circOut from 0.5 to 1
 *
 * Visual description:
 * Smooth acceleration then deceleration following circular arcs.
 * The motion is very smooth and organic, starting slowly, building speed
 * smoothly through the middle, then gently decelerating to a stop.
 * Like a pendulum swing - perfectly smooth and balanced.
 *
 * Common use cases:
 * - Smooth page transitions
 * - Modal animations
 * - Drawer slides
 * - Any animation requiring very smooth, natural motion
 *
 * Dependencies: circIn, mirrorEasing
 *
 * @example
 * ```ts
 * circInOut(0) // 0 (slow start)
 * circInOut(0.25) // ~0.067 (accelerating)
 * circInOut(0.5) // 0.5 (peak speed)
 * circInOut(0.75) // ~0.933 (decelerating)
 * circInOut(1) // 1 (slow stop)
 * ```
 */
export const circInOut = /*@__PURE__*/ mirrorEasing(circIn);
