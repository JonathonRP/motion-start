/**
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 */

import { cubicBezier } from './cubic-bezier';
import { mirrorEasing } from './modifiers/mirror';
import { reverseEasing } from './modifiers/reverse';

/**
 * Back out easing - overshoots the target then settles back.
 *
 * Mathematical explanation:
 * Uses a cubic bezier curve with control points (0.33, 1.53, 0.69, 0.99)
 * The second control point y-coordinate (1.53) exceeds 1.0, creating an overshoot.
 *
 * Visual description:
 * Smooth deceleration that overshoots the target before settling.
 * The animation moves quickly toward the end position, slightly overshoots it
 * (going beyond 100%), then smoothly pulls back to the final position.
 * Creates a natural, springy feeling like a door closing with slight bounce.
 *
 * Common use cases:
 * - Elements sliding into view
 * - Modal dialogs appearing
 * - Drawer/panel animations
 * - Any animation where a slight overshoot feels natural
 *
 * Dependencies: cubicBezier
 *
 * @example
 * ```ts
 * backOut(0) // 0 (starting)
 * backOut(0.7) // ~1.05 (overshooting past 1.0)
 * backOut(1) // 1 (settled at final position)
 * ```
 */
export const backOut = /*@__PURE__*/ cubicBezier(0.33, 1.53, 0.69, 0.99);

/**
 * Back in easing - pulls back before moving forward.
 *
 * Mathematical explanation:
 * Created by reversing backOut using the reverseEasing modifier.
 * This flips the overshoot to happen at the start instead of the end.
 *
 * Visual description:
 * Smooth acceleration that pulls back before moving forward.
 * The animation briefly moves backward (going below 0%), then accelerates
 * forward to the target. Like drawing back a slingshot before releasing,
 * or taking a step back before jumping forward.
 *
 * Common use cases:
 * - Elements leaving the screen
 * - Launching animations
 * - Drag-and-release effects
 * - Anticipatory movements
 *
 * Dependencies: backOut, reverseEasing
 *
 * @example
 * ```ts
 * backIn(0) // 0 (starting)
 * backIn(0.3) // ~-0.05 (pulling back below 0)
 * backIn(1) // 1 (final position)
 * ```
 */
export const backIn = /*@__PURE__*/ reverseEasing(backOut);

/**
 * Back in-out easing - pulls back at start, overshoots at end.
 *
 * Mathematical explanation:
 * Created by applying mirrorEasing to backIn, which creates a symmetrical
 * bidirectional version with pull-back at the start and overshoot at the end.
 *
 * Visual description:
 * Combines pull-back and overshoot for bidirectional springy motion.
 * - First half: Pulls back slightly before accelerating forward
 * - Second half: Continues forward, overshoots, then settles
 *
 * Creates a very playful, dynamic motion that feels elastic and responsive.
 * The animation has character and personality, drawing attention while
 * maintaining smoothness.
 *
 * Common use cases:
 * - Toggle switches
 * - Interactive UI elements
 * - Playful page transitions
 * - Attention-grabbing animations
 *
 * Dependencies: backIn, mirrorEasing
 *
 * @example
 * ```ts
 * backInOut(0) // 0 (starting)
 * backInOut(0.2) // ~-0.025 (pulling back)
 * backInOut(0.5) // 0.5 (midpoint)
 * backInOut(0.8) // ~1.025 (overshooting)
 * backInOut(1) // 1 (final position)
 * ```
 */
export const backInOut = /*@__PURE__*/ mirrorEasing(backIn);
