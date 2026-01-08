/**
 * Animation Engine
 *
 * Core animation primitives: spring, tween, keyframes, inertia
 */

import type {
	TransitionOptions,
	SpringOptions,
	TweenOptions,
	InertiaOptions,
	KeyframeOptions,
	AnimationPlaybackControls
} from './types.js';
import { getEasingFunction, mirrorEasing, reverseEasing } from './easing.js';

export type AnimationState = {
	value: number;
	velocity: number;
	done: boolean;
};

export type AnimationGenerator = {
	next: (delta: number) => AnimationState;
	flipTarget: () => void;
};

/**
 * Spring animation generator
 */
function springGenerator(options: {
	from: number;
	to: number;
	stiffness: number;
	damping: number;
	mass: number;
	velocity: number;
	restDelta: number;
	restSpeed: number;
}): AnimationGenerator {
	const { from, to, stiffness, damping, mass, restDelta, restSpeed } = options;
	let { velocity } = options;

	let position = from;
	let target = to;

	// Spring physics
	const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));

	return {
		next(delta: number) {
			// Convert to seconds
			const dt = delta / 1000;

			// Calculate spring force
			const displacement = position - target;
			const springForce = -stiffness * displacement;
			const dampingForce = -damping * velocity;

			// Apply forces
			const acceleration = (springForce + dampingForce) / mass;
			velocity += acceleration * dt;
			position += velocity * dt;

			// Check if at rest
			const isComplete = Math.abs(velocity) < restSpeed && Math.abs(target - position) < restDelta;

			if (isComplete) {
				position = target;
				velocity = 0;
			}

			return {
				value: position,
				velocity,
				done: isComplete
			};
		},
		flipTarget() {
			target = from;
		}
	};
}

/**
 * Tween animation generator
 */
function tweenGenerator(options: {
	from: number;
	to: number;
	duration: number;
	ease: (t: number) => number;
}): AnimationGenerator {
	const { from, to, duration, ease } = options;

	let elapsed = 0;
	let target = to;
	let startValue = from;

	return {
		next(delta: number) {
			elapsed += delta;
			const progress = Math.min(elapsed / (duration * 1000), 1);
			const easedProgress = ease(progress);

			const value = startValue + (target - startValue) * easedProgress;

			return {
				value,
				velocity: (target - startValue) / duration,
				done: progress >= 1
			};
		},
		flipTarget() {
			const temp = startValue;
			startValue = target;
			target = temp;
			elapsed = 0;
		}
	};
}

/**
 * Keyframes animation generator
 */
function keyframesGenerator(options: {
	values: number[];
	times: number[];
	ease: ((t: number) => number)[];
	duration: number;
}): AnimationGenerator {
	const { values, times, ease, duration } = options;

	let elapsed = 0;

	function getValueAtProgress(progress: number): number {
		// Find the current segment
		let segmentIndex = 0;
		for (let i = 0; i < times.length - 1; i++) {
			if (progress >= times[i] && progress <= times[i + 1]) {
				segmentIndex = i;
				break;
			}
		}

		const segmentStart = times[segmentIndex];
		const segmentEnd = times[segmentIndex + 1];
		const segmentProgress = (progress - segmentStart) / (segmentEnd - segmentStart);
		const easedProgress = ease[segmentIndex](segmentProgress);

		const valueStart = values[segmentIndex];
		const valueEnd = values[segmentIndex + 1];

		return valueStart + (valueEnd - valueStart) * easedProgress;
	}

	return {
		next(delta: number) {
			elapsed += delta;
			const progress = Math.min(elapsed / (duration * 1000), 1);
			const value = getValueAtProgress(progress);

			return {
				value,
				velocity: 0, // Keyframes don't track velocity
				done: progress >= 1
			};
		},
		flipTarget() {
			// Reverse the keyframes
			values.reverse();
			elapsed = 0;
		}
	};
}

/**
 * Inertia animation generator (decay with optional bounds)
 */
function inertiaGenerator(options: {
	from: number;
	velocity: number;
	power: number;
	min?: number;
	max?: number;
	bounceStiffness: number;
	bounceDamping: number;
	restDelta: number;
	modifyTarget?: (target: number) => number;
}): AnimationGenerator {
	const { from, power, min, max, bounceStiffness, bounceDamping, restDelta, modifyTarget } = options;

	let { velocity } = options;
	let position = from;

	// Calculate target based on velocity and power
	const amplitude = velocity * power;
	let target = from + amplitude;

	if (modifyTarget) {
		target = modifyTarget(target);
	}

	// Clamp target to bounds
	if (min !== undefined && target < min) target = min;
	if (max !== undefined && target > max) target = max;

	// Check if we need to bounce
	let isBouncing = false;

	return {
		next(delta: number) {
			const dt = delta / 1000;

			if (isBouncing) {
				// Spring back to constraint
				const constraint = position < (min ?? -Infinity) ? min! : max!;
				const displacement = position - constraint;
				const springForce = -bounceStiffness * displacement;
				const dampingForce = -bounceDamping * velocity;

				const acceleration = springForce + dampingForce;
				velocity += acceleration * dt;
				position += velocity * dt;

				const done = Math.abs(velocity) < 0.01 && Math.abs(displacement) < restDelta;
				if (done) {
					position = constraint;
					velocity = 0;
				}

				return { value: position, velocity, done };
			}

			// Decay animation
			const decay = Math.exp(-dt / power);
			position = target + (position - target) * decay;
			velocity *= decay;

			// Check bounds
			if ((min !== undefined && position < min) || (max !== undefined && position > max)) {
				isBouncing = true;
			}

			const done = Math.abs(velocity) < 0.01 && Math.abs(target - position) < restDelta;

			return {
				value: position,
				velocity,
				done: done && !isBouncing
			};
		},
		flipTarget() {
			// Inertia doesn't flip
		}
	};
}

/**
 * Create an animation generator from options
 */
export function createAnimationGenerator(
	from: number,
	to: number,
	options: TransitionOptions,
	initialVelocity: number = 0
): AnimationGenerator {
	if (options.type === 'spring') {
		return springGenerator({
			from,
			to,
			stiffness: options.stiffness ?? 100,
			damping: options.damping ?? 10,
			mass: options.mass ?? 1,
			velocity: options.velocity ?? initialVelocity,
			restDelta: options.restDelta ?? 0.01,
			restSpeed: options.restSpeed ?? 0.01
		});
	}

	if (options.type === 'inertia') {
		return inertiaGenerator({
			from,
			velocity: options.velocity ?? initialVelocity,
			power: options.power ?? 0.8,
			min: options.min,
			max: options.max,
			bounceStiffness: options.bounceStiffness ?? 500,
			bounceDamping: options.bounceDamping ?? 10,
			restDelta: options.restDelta ?? 0.01,
			modifyTarget: options.modifyTarget
		});
	}

	if (options.type === 'keyframes') {
		const { values, duration = 0.3 } = options;
		const times = options.times ?? values.map((_, i) => i / (values.length - 1));
		const eases = Array.isArray(options.ease)
			? options.ease.map(getEasingFunction)
			: Array(values.length - 1).fill(getEasingFunction(options.ease ?? 'easeOut'));

		return keyframesGenerator({
			values,
			times,
			ease: eases,
			duration
		});
	}

	// Default: tween
	const tweenOpts = options as TweenOptions;
	return tweenGenerator({
		from,
		to,
		duration: tweenOpts.duration ?? 0.3,
		ease: getEasingFunction(tweenOpts.ease ?? 'easeOut')
	});
}

/**
 * Main animation function
 *
 * @example
 * ```ts
 * const controls = animate(0, 100, {
 *   type: 'spring',
 *   stiffness: 200,
 *   onUpdate: (v) => x.set(v)
 * });
 *
 * // Later: stop
 * controls.stop();
 * ```
 */
export function animate(
	from: number,
	to: number,
	options: TransitionOptions & {
		onUpdate?: (value: number) => void;
		onComplete?: () => void;
		velocity?: number;
	} = {}
): AnimationPlaybackControls {
	const { onUpdate, onComplete, velocity = 0, ...transitionOptions } = options;

	// Handle delay
	const delay = ('delay' in options ? options.delay : 0) ?? 0;
	const repeat = ('repeat' in options ? options.repeat : 0) ?? 0;
	const repeatType = ('repeatType' in options ? options.repeatType : 'loop') ?? 'loop';
	const repeatDelay = ('repeatDelay' in options ? options.repeatDelay : 0) ?? 0;

	let generator = createAnimationGenerator(from, to, transitionOptions as TransitionOptions, velocity);

	let frameId: number | null = null;
	let lastTime: number | null = null;
	let delayRemaining = delay * 1000;
	let repeatCount = 0;
	let repeatDelayRemaining = 0;
	let isReversed = false;
	let resolveFinished: () => void;
	let rejectFinished: () => void;

	const finished = new Promise<void>((resolve, reject) => {
		resolveFinished = resolve;
		rejectFinished = reject;
	});

	function tick(time: number) {
		if (lastTime === null) {
			lastTime = time;
			frameId = requestAnimationFrame(tick);
			return;
		}

		const delta = time - lastTime;
		lastTime = time;

		// Handle delay
		if (delayRemaining > 0) {
			delayRemaining -= delta;
			frameId = requestAnimationFrame(tick);
			return;
		}

		// Handle repeat delay
		if (repeatDelayRemaining > 0) {
			repeatDelayRemaining -= delta;
			frameId = requestAnimationFrame(tick);
			return;
		}

		const state = generator.next(delta);
		onUpdate?.(state.value);

		if (state.done) {
			// Handle repeat
			if (repeatCount < repeat) {
				repeatCount++;
				repeatDelayRemaining = repeatDelay * 1000;

				if (repeatType === 'reverse' || repeatType === 'mirror') {
					isReversed = !isReversed;
					generator.flipTarget();
				} else {
					// Loop - recreate generator
					generator = createAnimationGenerator(from, to, transitionOptions as TransitionOptions, 0);
				}

				lastTime = null;
				frameId = requestAnimationFrame(tick);
				return;
			}

			onComplete?.();
			resolveFinished();
			return;
		}

		frameId = requestAnimationFrame(tick);
	}

	// Start animation
	frameId = requestAnimationFrame(tick);

	return {
		stop() {
			if (frameId !== null) {
				cancelAnimationFrame(frameId);
				frameId = null;
			}
		},
		finished,
		then(onResolve, onReject) {
			return finished.then(onResolve, onReject);
		}
	};
}

/**
 * Animate multiple values in parallel
 */
export function animateValues(
	values: Record<string, { from: number; to: number }>,
	options: TransitionOptions & {
		onUpdate?: (values: Record<string, number>) => void;
		onComplete?: () => void;
	} = {}
): AnimationPlaybackControls {
	const keys = Object.keys(values);
	const currentValues: Record<string, number> = {};
	const controls: AnimationPlaybackControls[] = [];

	keys.forEach((key) => {
		currentValues[key] = values[key].from;
	});

	const { onUpdate, onComplete, ...transitionOptions } = options;

	keys.forEach((key) => {
		const { from, to } = values[key];
		controls.push(
			animate(from, to, {
				...transitionOptions,
				onUpdate: (v) => {
					currentValues[key] = v;
					onUpdate?.(currentValues);
				}
			})
		);
	});

	const finished = Promise.all(controls.map((c) => c.finished)).then(() => {
		onComplete?.();
	});

	return {
		stop() {
			controls.forEach((c) => c.stop());
		},
		finished,
		then(onResolve, onReject) {
			return finished.then(onResolve, onReject);
		}
	};
}
