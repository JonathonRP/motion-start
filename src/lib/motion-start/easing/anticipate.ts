/**
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 */

import { backIn } from './back';
import type { EasingFunction } from './types';

/**
 * Anticipate easing - pulls back then accelerates forward with exponential curve.
 *
 * Mathematical explanation:
 * The function behaves differently in two phases:
 *
 * Phase 1 (p < 0.5):
 *   - Doubles the progress: p *= 2 → range [0, 1]
 *   - Applies backIn easing: creates pull-back effect
 *   - Scales by 0.5: fits into first half of output range [0, 0.5]
 *   - Result: 0.5 * backIn(2p)
 *
 * Phase 2 (p >= 0.5):
 *   - Transforms p to range from 1 to 0: (p - 1) gives [-0.5, 0]
 *   - Scales by -10: gives [5, 0]
 *   - Applies exponential: 2^(-10(p-1)) creates sharp deceleration
 *   - Inverts and scales: 0.5 * (2 - 2^(-10(p-1)))
 *   - Result: smooth approach to 1.0
 *
 * Visual description:
 * Dramatic anticipatory motion with pull-back then rapid acceleration.
 * - First half: Pulls back (like backIn) to build anticipation
 * - Second half: Rapidly accelerates forward with exponential curve
 *
 * The motion is highly dynamic and attention-grabbing. It's like a runner
 * taking a step back before sprinting forward, or a baseball pitcher winding
 * up before throwing. Creates strong sense of momentum and purpose.
 *
 * Common use cases:
 * - Launch animations
 * - Button press effects with strong feedback
 * - Dramatic entrance animations
 * - Game UI elements
 * - Attention-demanding interactions
 *
 * Dependencies: backIn
 *
 * @example
 * ```ts
 * anticipate(0) // 0 (starting position)
 * anticipate(0.25) // ~-0.025 (pulling back)
 * anticipate(0.5) // ~0.065 (finished pull-back, starting forward)
 * anticipate(0.75) // ~0.532 (rapidly accelerating)
 * anticipate(0.9) // ~0.903 (approaching target)
 * anticipate(1) // 1 (final position)
 * ```
 */
export const anticipate: EasingFunction = (p) =>
	(p *= 2) < 1 ? 0.5 * backIn(p) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
