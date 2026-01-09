/**
 * Spring Animation - Built on Svelte's Spring primitive
 *
 * Re-exports and extends Svelte's Spring class with motion-specific utilities.
 * Use this for physics-based animations that feel natural and responsive.
 */

import { Spring as SvelteSpring } from 'svelte/motion';

// Re-export Svelte's Spring class directly for full control
export { Spring as SvelteSpring } from 'svelte/motion';

export type SpringOptions = {
	/** Spring stiffness (0-1). Higher = snappier. Default: 0.15 */
	stiffness?: number;
	/** Spring damping (0-1). Higher = less oscillation. Default: 0.8 */
	damping?: number;
	/** Precision threshold for settling. Default: 0.01 */
	precision?: number;
};

export type SpringValue<T> = {
	/** Current animated value (reactive) */
	readonly current: T;
	/** Target value the spring is moving towards */
	target: T;
	/** Spring stiffness */
	stiffness: number;
	/** Spring damping */
	damping: number;
	/** Animate to a new value, returns promise that resolves when settled */
	set(value: T, opts?: { instant?: boolean; preserveMomentum?: number }): Promise<void>;
	/** Immediately snap to value */
	snap(value: T): void;
};

/**
 * Creates a spring-animated value using Svelte's Spring primitive.
 *
 * @example
 * ```svelte
 * <script>
 *   import { spring } from '$lib/motion';
 *
 *   const scale = spring(1, { stiffness: 0.3, damping: 0.6 });
 *
 *   function onHover() {
 *     scale.target = 1.1;
 *   }
 * </script>
 *
 * <div
 *   style="transform: scale({scale.current})"
 *   onmouseenter={onHover}
 *   onmouseleave={() => scale.target = 1}
 * />
 * ```
 */
export function spring<T>(initial: T, options: SpringOptions = {}): SpringValue<T> {
	const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = options;

	const svelteSpring = new SvelteSpring(initial, { stiffness, damping, precision });

	return {
		get current() {
			return svelteSpring.current;
		},
		get target() {
			return svelteSpring.target;
		},
		set target(value: T) {
			svelteSpring.target = value;
		},
		get stiffness() {
			return svelteSpring.stiffness;
		},
		set stiffness(value: number) {
			svelteSpring.stiffness = value;
		},
		get damping() {
			return svelteSpring.damping;
		},
		set damping(value: number) {
			svelteSpring.damping = value;
		},
		set(value: T, opts) {
			return svelteSpring.set(value, opts);
		},
		snap(value: T) {
			svelteSpring.set(value, { instant: true });
		}
	};
}

/**
 * Creates a spring that follows a reactive value.
 * The spring automatically animates when the source changes.
 *
 * @example
 * ```svelte
 * <script>
 *   import { springFrom } from '$lib/motion';
 *
 *   let { value } = $props();
 *
 *   // Automatically springs to new values when `value` prop changes
 *   const animated = springFrom(() => value, { stiffness: 0.2 });
 * </script>
 *
 * <div style="transform: translateX({animated.current}px)" />
 * ```
 */
export function springFrom<T>(fn: () => T, options: SpringOptions = {}): SpringValue<T> {
	const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = options;

	const svelteSpring = SvelteSpring.of(fn, { stiffness, damping, precision });

	return {
		get current() {
			return svelteSpring.current;
		},
		get target() {
			return svelteSpring.target;
		},
		set target(value: T) {
			svelteSpring.target = value;
		},
		get stiffness() {
			return svelteSpring.stiffness;
		},
		set stiffness(value: number) {
			svelteSpring.stiffness = value;
		},
		get damping() {
			return svelteSpring.damping;
		},
		set damping(value: number) {
			svelteSpring.damping = value;
		},
		set(value: T, opts) {
			return svelteSpring.set(value, opts);
		},
		snap(value: T) {
			svelteSpring.set(value, { instant: true });
		}
	};
}

/**
 * Creates multiple springs for an object of values.
 *
 * @example
 * ```svelte
 * <script>
 *   import { springObject } from '$lib/motion';
 *
 *   const position = springObject({ x: 0, y: 0 });
 *
 *   function onDragEnd(event) {
 *     // Spring will continue momentum after release
 *     position.set({ x: event.x, y: event.y }, { preserveMomentum: 300 });
 *   }
 * </script>
 *
 * <div style="transform: translate({position.current.x}px, {position.current.y}px)" />
 * ```
 */
export function springObject<T extends Record<string, number>>(
	initial: T,
	options: SpringOptions = {}
): SpringValue<T> {
	return spring(initial, options);
}

/**
 * Creates a spring with momentum preservation for gestures.
 * Useful for drag/fling interactions where you want physics-based deceleration.
 *
 * @example
 * ```svelte
 * <script>
 *   import { springWithMomentum } from '$lib/motion';
 *
 *   const x = springWithMomentum(0, { momentumDuration: 500 });
 *
 *   function onDragEnd() {
 *     // Continues in direction of drag with deceleration
 *     x.release();
 *   }
 * </script>
 * ```
 */
export function springWithMomentum<T>(
	initial: T,
	options: SpringOptions & { momentumDuration?: number } = {}
): SpringValue<T> & { release(): Promise<void> } {
	const { momentumDuration = 300, ...springOpts } = options;
	const s = spring(initial, springOpts);

	return {
		...s,
		/** Release with momentum - continues current trajectory */
		release() {
			// Use Svelte's preserveMomentum feature
			return (s as any).set(s.current, { preserveMomentum: momentumDuration });
		}
	};
}
