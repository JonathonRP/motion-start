/**
 * Motion Value - Runes-native reactive animation primitive
 *
 * A MotionValue tracks a single animatable value with:
 * - Fine-grained reactivity via $state
 * - Velocity tracking for physics-based animations
 * - Animation lifecycle management
 */

import { untrack } from 'svelte';

export type MotionValueOptions = {
	/** Called when value changes */
	onChange?: (value: number) => void;
	/** Called when animation completes */
	onAnimationComplete?: () => void;
};

export type MotionValueState<T = number> = {
	/** Current value */
	readonly current: T;
	/** Previous value (for velocity calculation) */
	readonly previous: T;
	/** Current velocity (units per second) */
	readonly velocity: number;
	/** Whether currently animating */
	readonly isAnimating: boolean;
	/** Set value immediately (no animation) */
	set(value: T): void;
	/** Jump to value without triggering animations */
	jump(value: T): void;
	/** Get current value (untracked) */
	get(): T;
	/** Stop any active animation */
	stop(): void;
	/** Destroy and cleanup */
	destroy(): void;
	/** Subscribe to value changes */
	on(event: 'change', callback: (value: T) => void): () => void;
	on(event: 'animationStart', callback: () => void): () => void;
	on(event: 'animationComplete', callback: () => void): () => void;
};

type Subscriber<T> = (value: T) => void;
type SubscriberMap<T> = {
	change: Set<Subscriber<T>>;
	animationStart: Set<() => void>;
	animationComplete: Set<() => void>;
};

/**
 * Creates a reactive motion value that can be animated
 *
 * @example
 * ```ts
 * const x = motionValue(0);
 *
 * // Read reactively
 * $effect(() => {
 *   console.log('x is now', x.current);
 * });
 *
 * // Set immediately
 * x.set(100);
 *
 * // Get velocity for physics
 * console.log(x.velocity);
 * ```
 */
export function motionValue<T extends number>(initial: T): MotionValueState<T> {
	// Core reactive state
	let current = $state(initial);
	let previous = $state(initial);
	let velocity = $state(0);
	let isAnimating = $state(false);

	// Velocity tracking
	let lastUpdateTime = performance.now();
	let velocityHistory: { value: T; time: number }[] = [];
	const VELOCITY_SAMPLE_DURATION = 50; // ms

	// Animation state
	let stopAnimation: (() => void) | null = null;

	// Event subscribers
	const subscribers: SubscriberMap<T> = {
		change: new Set(),
		animationStart: new Set(),
		animationComplete: new Set()
	};

	function updateVelocity(newValue: T, time: number) {
		// Add to history
		velocityHistory.push({ value: newValue, time });

		// Remove old samples
		const cutoff = time - VELOCITY_SAMPLE_DURATION;
		velocityHistory = velocityHistory.filter((s) => s.time > cutoff);

		// Calculate velocity from samples
		if (velocityHistory.length >= 2) {
			const oldest = velocityHistory[0];
			const newest = velocityHistory[velocityHistory.length - 1];
			const timeDelta = (newest.time - oldest.time) / 1000; // to seconds

			if (timeDelta > 0) {
				velocity = ((newest.value as number) - (oldest.value as number)) / timeDelta;
			}
		}

		lastUpdateTime = time;
	}

	function notify<K extends keyof SubscriberMap<T>>(event: K, value?: T) {
		if (event === 'change') {
			subscribers.change.forEach((cb) => cb(value as T));
		} else if (event === 'animationStart') {
			subscribers.animationStart.forEach((cb) => cb());
		} else if (event === 'animationComplete') {
			subscribers.animationComplete.forEach((cb) => cb());
		}
	}

	const state: MotionValueState<T> = {
		get current() {
			return current;
		},
		get previous() {
			return previous;
		},
		get velocity() {
			return velocity;
		},
		get isAnimating() {
			return isAnimating;
		},

		set(value: T) {
			const now = performance.now();
			previous = current;
			current = value;
			updateVelocity(value, now);
			notify('change', value);
		},

		jump(value: T) {
			// Set without velocity update
			previous = value;
			current = value;
			velocity = 0;
			velocityHistory = [];
		},

		get() {
			return untrack(() => current);
		},

		stop() {
			if (stopAnimation) {
				stopAnimation();
				stopAnimation = null;
			}
			isAnimating = false;
			notify('animationComplete');
		},

		destroy() {
			state.stop();
			subscribers.change.clear();
			subscribers.animationStart.clear();
			subscribers.animationComplete.clear();
		},

		on(event: keyof SubscriberMap<T>, callback: any) {
			subscribers[event].add(callback);
			return () => {
				subscribers[event].delete(callback);
			};
		}
	};

	// Internal method to set animation controller
	(state as any)._setAnimationController = (stop: () => void) => {
		stopAnimation = stop;
		isAnimating = true;
		notify('animationStart');
	};

	(state as any)._completeAnimation = () => {
		stopAnimation = null;
		isAnimating = false;
		notify('animationComplete');
	};

	return state;
}

/**
 * Creates a derived motion value that transforms another motion value
 *
 * @example
 * ```ts
 * const x = motionValue(0);
 * const opacity = motionTransform(x, [0, 100], [1, 0]);
 * // opacity.current automatically updates when x changes
 * ```
 */
export function motionTransform<T extends number, O extends number>(
	value: MotionValueState<T>,
	inputRange: number[],
	outputRange: O[],
	options?: { clamp?: boolean }
): MotionValueState<O> {
	const { clamp = true } = options ?? {};

	function interpolate(input: number): O {
		// Find the range segment
		let i = 0;
		for (; i < inputRange.length - 1; i++) {
			if (input < inputRange[i + 1]) break;
		}
		i = Math.min(i, inputRange.length - 2);

		// Calculate progress within segment
		const inputStart = inputRange[i];
		const inputEnd = inputRange[i + 1];
		let progress = (input - inputStart) / (inputEnd - inputStart);

		if (clamp) {
			progress = Math.max(0, Math.min(1, progress));
		}

		// Interpolate output
		const outputStart = outputRange[i];
		const outputEnd = outputRange[i + 1];
		return (outputStart + (outputEnd - outputStart) * progress) as O;
	}

	// Create derived motion value
	const derived = motionValue(interpolate(value.get()));

	// Subscribe to source changes
	const unsub = value.on('change', (v) => {
		derived.set(interpolate(v as number) as O);
	});

	// Override destroy to cleanup subscription
	const originalDestroy = derived.destroy;
	derived.destroy = () => {
		unsub();
		originalDestroy();
	};

	return derived;
}

/**
 * Combines multiple motion values into one
 *
 * @example
 * ```ts
 * const x = motionValue(0);
 * const y = motionValue(0);
 * const combined = motionCombine([x, y], ([xVal, yVal]) => xVal + yVal);
 * ```
 */
export function motionCombine<T extends number[], O extends number>(
	values: { [K in keyof T]: MotionValueState<T[K]> },
	combiner: (values: T) => O
): MotionValueState<O> {
	function getCombined(): O {
		const currentValues = values.map((v) => v.get()) as T;
		return combiner(currentValues);
	}

	const derived = motionValue(getCombined());

	// Subscribe to all source changes
	const unsubs = values.map((v) =>
		v.on('change', () => {
			derived.set(getCombined());
		})
	);

	// Override destroy
	const originalDestroy = derived.destroy;
	derived.destroy = () => {
		unsubs.forEach((unsub) => unsub());
		originalDestroy();
	};

	return derived;
}
