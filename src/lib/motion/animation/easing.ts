/**
 * Easing Functions
 */

import type { Easing } from './types.js';

// Cubic bezier implementation
function cubicBezier(p1x: number, p1y: number, p2x: number, p2y: number) {
	const NEWTON_ITERATIONS = 4;
	const NEWTON_MIN_SLOPE = 0.001;
	const SUBDIVISION_PRECISION = 0.0000001;
	const SUBDIVISION_MAX_ITERATIONS = 10;

	const kSplineTableSize = 11;
	const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

	function A(a1: number, a2: number) {
		return 1.0 - 3.0 * a2 + 3.0 * a1;
	}
	function B(a1: number, a2: number) {
		return 3.0 * a2 - 6.0 * a1;
	}
	function C(a1: number) {
		return 3.0 * a1;
	}

	function calcBezier(t: number, a1: number, a2: number) {
		return ((A(a1, a2) * t + B(a1, a2)) * t + C(a1)) * t;
	}

	function getSlope(t: number, a1: number, a2: number) {
		return 3.0 * A(a1, a2) * t * t + 2.0 * B(a1, a2) * t + C(a1);
	}

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
			if (currentSlope === 0.0) {
				return guessT;
			}
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

		const dist = (x - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
		const guessForT = intervalStart + dist * kSampleStepSize;

		const initialSlope = getSlope(guessForT, p1x, p2x);
		if (initialSlope >= NEWTON_MIN_SLOPE) {
			return newtonRaphsonIterate(x, guessForT, p1x, p2x);
		} else if (initialSlope === 0.0) {
			return guessForT;
		} else {
			return binarySubdivide(x, intervalStart, intervalStart + kSampleStepSize, p1x, p2x);
		}
	}

	return function (x: number) {
		if (p1x === p1y && p2x === p2y) {
			return x; // linear
		}
		if (x === 0 || x === 1) {
			return x;
		}
		return calcBezier(getTForX(x), p1y, p2y);
	};
}

// Pre-built easing functions
const easingFunctions = {
	linear: (t: number) => t,
	easeIn: cubicBezier(0.4, 0, 1, 1),
	easeOut: cubicBezier(0, 0, 0.2, 1),
	easeInOut: cubicBezier(0.4, 0, 0.2, 1),
	circIn: (t: number) => 1 - Math.sqrt(1 - t * t),
	circOut: (t: number) => Math.sqrt(1 - --t * t),
	circInOut: (t: number) =>
		t < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2,
	backIn: cubicBezier(0.36, 0, 0.66, -0.56),
	backOut: cubicBezier(0.34, 1.56, 0.64, 1),
	backInOut: cubicBezier(0.68, -0.6, 0.32, 1.6),
	anticipate: (t: number) => {
		const s = 1.70158 * 1.525;
		return (t *= 2) < 1 ? 0.5 * (t * t * ((s + 1) * t - s)) : 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2);
	}
};

/**
 * Get easing function from easing definition
 */
export function getEasingFunction(easing: Easing): (t: number) => number {
	if (Array.isArray(easing)) {
		return cubicBezier(easing[0], easing[1], easing[2], easing[3]);
	}
	return easingFunctions[easing] ?? easingFunctions.easeOut;
}

/**
 * Create a mirrored easing function
 */
export function mirrorEasing(easing: (t: number) => number): (t: number) => number {
	return (t) => (t < 0.5 ? easing(2 * t) / 2 : (2 - easing(2 * (1 - t))) / 2);
}

/**
 * Create a reversed easing function
 */
export function reverseEasing(easing: (t: number) => number): (t: number) => number {
	return (t) => 1 - easing(1 - t);
}
