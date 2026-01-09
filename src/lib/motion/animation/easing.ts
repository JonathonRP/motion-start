/**
 * Easing Functions
 *
 * Re-exports all Svelte easing functions with additional utilities
 * for composition and custom cubic-bezier curves.
 */

// Re-export all Svelte easings for direct use
export {
	linear,
	sineIn,
	sineOut,
	sineInOut,
	quadIn,
	quadOut,
	quadInOut,
	cubicIn,
	cubicOut,
	cubicInOut,
	quartIn,
	quartOut,
	quartInOut,
	quintIn,
	quintOut,
	quintInOut,
	expoIn,
	expoOut,
	expoInOut,
	circIn,
	circOut,
	circInOut,
	backIn,
	backOut,
	backInOut,
	elasticIn,
	elasticOut,
	elasticInOut,
	bounceIn,
	bounceOut,
	bounceInOut
} from 'svelte/easing';

import * as svelteEasing from 'svelte/easing';
import type { Easing } from './types.js';

export type EasingFunction = (t: number) => number;

/**
 * Cubic bezier implementation for custom easing curves.
 * Supports arbitrary [x1, y1, x2, y2] bezier definitions.
 */
function cubicBezier(p1x: number, p1y: number, p2x: number, p2y: number): EasingFunction {
	const NEWTON_ITERATIONS = 4;
	const NEWTON_MIN_SLOPE = 0.001;
	const SUBDIVISION_PRECISION = 0.0000001;
	const SUBDIVISION_MAX_ITERATIONS = 10;

	const kSplineTableSize = 11;
	const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

	const A = (a1: number, a2: number) => 1.0 - 3.0 * a2 + 3.0 * a1;
	const B = (a1: number, a2: number) => 3.0 * a2 - 6.0 * a1;
	const C = (a1: number) => 3.0 * a1;

	const calcBezier = (t: number, a1: number, a2: number) => ((A(a1, a2) * t + B(a1, a2)) * t + C(a1)) * t;

	const getSlope = (t: number, a1: number, a2: number) => 3.0 * A(a1, a2) * t * t + 2.0 * B(a1, a2) * t + C(a1);

	function binarySubdivide(x: number, a: number, b: number, mX1: number, mX2: number) {
		let currentX: number;
		let currentT: number;
		let i = 0;
		do {
			currentT = a + (b - a) / 2.0;
			currentX = calcBezier(currentT, mX1, mX2) - x;
			if (currentX > 0.0) {
				b = currentT;
			} else {
				a = currentT;
			}
		} while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
		return currentT;
	}

	function newtonRaphsonIterate(x: number, guessT: number, mX1: number, mX2: number) {
		for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
			const currentSlope = getSlope(guessT, mX1, mX2);
			if (currentSlope === 0.0) return guessT;
			const currentX = calcBezier(guessT, mX1, mX2) - x;
			guessT -= currentX / currentSlope;
		}
		return guessT;
	}

	// Pre-compute samples
	const sampleValues: number[] = [];
	for (let i = 0; i < kSplineTableSize; ++i) {
		sampleValues[i] = calcBezier(i * kSampleStepSize, p1x, p2x);
	}

	function getTForX(x: number) {
		let intervalStart = 0.0;
		let currentSample = 1;
		const lastSample = kSplineTableSize - 1;

		for (; currentSample !== lastSample && sampleValues[currentSample] <= x; ++currentSample) {
			intervalStart += kSampleStepSize;
		}
		--currentSample;

		const dist =
			(x - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
		const guessForT = intervalStart + dist * kSampleStepSize;

		const initialSlope = getSlope(guessForT, p1x, p2x);
		if (initialSlope >= NEWTON_MIN_SLOPE) {
			return newtonRaphsonIterate(x, guessForT, p1x, p2x);
		} else if (initialSlope === 0.0) {
			return guessForT;
		}
		return binarySubdivide(x, intervalStart, intervalStart + kSampleStepSize, p1x, p2x);
	}

	return (x: number) => {
		if (p1x === p1y && p2x === p2y) return x; // linear
		if (x === 0 || x === 1) return x;
		return calcBezier(getTForX(x), p1y, p2y);
	};
}

// CSS standard cubic-bezier presets (different from Svelte's polynomial easings)
const cssEasings = {
	easeIn: cubicBezier(0.4, 0, 1, 1),
	easeOut: cubicBezier(0, 0, 0.2, 1),
	easeInOut: cubicBezier(0.4, 0, 0.2, 1)
};

// Combined easing map: Svelte built-ins + CSS presets + aliases
const easingFunctions: Record<string, EasingFunction> = {
	...svelteEasing,
	...cssEasings,
	// Aliases for compatibility
	anticipate: svelteEasing.backInOut
};

/**
 * Get easing function from name or cubic-bezier array
 */
export function getEasingFunction(easing: Easing): EasingFunction {
	if (Array.isArray(easing)) {
		return cubicBezier(easing[0], easing[1], easing[2], easing[3]);
	}
	return easingFunctions[easing] ?? cssEasings.easeOut;
}

// ============================================================================
// Easing Composition Utilities
// ============================================================================

/**
 * Reverse an easing function (out becomes in, in becomes out)
 * @example reverseEasing(quadIn) // equivalent to quadOut
 */
export function reverseEasing(easing: EasingFunction): EasingFunction {
	return (t) => 1 - easing(1 - t);
}

/**
 * Mirror an easing function (applies easing to both halves symmetrically)
 * @example mirrorEasing(quadIn) // eases in first half, eases out second half
 */
export function mirrorEasing(easing: EasingFunction): EasingFunction {
	return (t) => (t < 0.5 ? easing(2 * t) / 2 : (2 - easing(2 * (1 - t))) / 2);
}

/**
 * Create a sequence of easings that transition at specified points
 * @example sequenceEasing([quadIn, linear, quadOut], [0.3, 0.7])
 */
export function sequenceEasing(easings: EasingFunction[], breakpoints: number[]): EasingFunction {
	if (easings.length !== breakpoints.length + 1) {
		throw new Error('Need exactly one more easing than breakpoints');
	}

	return (t) => {
		let segmentStart = 0;
		for (let i = 0; i < breakpoints.length; i++) {
			const segmentEnd = breakpoints[i];
			if (t <= segmentEnd) {
				const segmentT = (t - segmentStart) / (segmentEnd - segmentStart);
				const segmentValue = easings[i](segmentT);
				return segmentStart + segmentValue * (segmentEnd - segmentStart);
			}
			segmentStart = segmentEnd;
		}
		// Last segment
		const segmentT = (t - segmentStart) / (1 - segmentStart);
		const segmentValue = easings[easings.length - 1](segmentT);
		return segmentStart + segmentValue * (1 - segmentStart);
	};
}

/**
 * Blend two easing functions together
 * @param weight 0 = all easing1, 1 = all easing2, 0.5 = equal mix
 * @example blendEasing(linear, quadOut, 0.5)
 */
export function blendEasing(easing1: EasingFunction, easing2: EasingFunction, weight: number): EasingFunction {
	return (t) => easing1(t) * (1 - weight) + easing2(t) * weight;
}

/**
 * Apply easing only to a portion of the timeline
 * @example clampEasing(quadOut, 0.2, 0.8) // easing only happens between 20% and 80%
 */
export function clampEasing(easing: EasingFunction, start: number, end: number): EasingFunction {
	return (t) => {
		if (t <= start) return 0;
		if (t >= end) return 1;
		return easing((t - start) / (end - start));
	};
}

/**
 * Scale the intensity of an easing (power curve modifier)
 * @param intensity >1 = more pronounced, <1 = more subtle
 * @example scaleEasing(quadIn, 2) // more aggressive curve
 */
export function scaleEasing(easing: EasingFunction, intensity: number): EasingFunction {
	return (t) => Math.pow(easing(t), intensity);
}
