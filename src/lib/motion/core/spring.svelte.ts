/**
 * Spring Animation
 *
 * Provides two spring models:
 * 1. Svelte-based springs (normalized 0-1 parameters)
 * 2. Physics-based springs (traditional stiffness/damping/mass)
 */

import { Spring as SvelteSpring } from 'svelte/motion';

// Re-export Svelte's Spring class for direct access
export { Spring as SvelteSpring } from 'svelte/motion';

// ============================================================================
// Svelte-based Spring (normalized parameters 0-1)
// ============================================================================

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
	/** Spring stiffness (0-1) */
	stiffness: number;
	/** Spring damping (0-1) */
	damping: number;
	/** Animate to a new value, returns promise that resolves when settled */
	set(value: T, opts?: { instant?: boolean; preserveMomentum?: number }): Promise<void>;
	/** Immediately snap to value */
	snap(value: T): void;
};

/**
 * Creates a spring-animated value using Svelte's Spring primitive.
 * Uses normalized parameters (0-1 scale).
 *
 * For physics-based parameters, use `physicsSpring()` instead.
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
 * Uses Svelte's Spring.of() internally.
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
 * Creates a spring for object values.
 */
export function springObject<T extends Record<string, number>>(
	initial: T,
	options: SpringOptions = {}
): SpringValue<T> {
	return spring(initial, options);
}

// ============================================================================
// Physics-based Spring (traditional parameters)
// ============================================================================

export type PhysicsSpringOptions = {
	/** Stiffness of the spring. Higher = snappier. Default: 100 */
	stiffness?: number;
	/** Damping coefficient. Higher = less oscillation. Default: 10 */
	damping?: number;
	/** Mass of the object. Higher = more momentum. Default: 1 */
	mass?: number;
	/** Velocity threshold for settling. Default: 0.01 */
	restVelocity?: number;
	/** Displacement threshold for settling. Default: 0.01 */
	restDelta?: number;
};

export type PhysicsSpringValue<T extends number = number> = {
	/** Current animated value (reactive) */
	readonly current: T;
	/** Current velocity */
	readonly velocity: number;
	/** Target value */
	target: T;
	/** Set target with optional velocity */
	set(value: T, velocity?: number): void;
	/** Immediately snap to value */
	snap(value: T): void;
	/** Stop the spring animation */
	stop(): void;
};

/**
 * Creates a physics-based spring with traditional parameters.
 *
 * Uses real spring physics: F = -kx - cv, a = F/m
 *
 * @example
 * ```svelte
 * <script>
 *   import { physicsSpring } from '$lib/motion';
 *
 *   const x = physicsSpring(0, {
 *     stiffness: 300,  // Spring constant (k)
 *     damping: 20,     // Damping coefficient (c)
 *     mass: 1          // Mass (m)
 *   });
 *
 *   // Animate to new position
 *   x.target = 100;
 *
 *   // Or set with initial velocity (for gestures)
 *   x.set(100, 500); // target=100, velocity=500
 * </script>
 * ```
 */
export function physicsSpring<T extends number>(
	initial: T,
	options: PhysicsSpringOptions = {}
): PhysicsSpringValue<T> {
	const {
		stiffness = 100,
		damping = 10,
		mass = 1,
		restVelocity = 0.01,
		restDelta = 0.01
	} = options;

	let current = $state(initial);
	let velocity = $state(0);
	let target = $state(initial);
	let animationFrame: number | null = null;

	function step() {
		// Spring physics: F = -kx - cv, a = F/m
		const displacement = current - target;
		const springForce = -stiffness * displacement;
		const dampingForce = -damping * velocity;
		const acceleration = (springForce + dampingForce) / mass;

		// Update velocity and position (assuming 60fps)
		const dt = 1 / 60;
		velocity += acceleration * dt;
		current = (current + velocity * dt) as T;

		// Check if settled
		const isSettled = Math.abs(velocity) < restVelocity && Math.abs(target - current) < restDelta;

		if (isSettled) {
			current = target;
			velocity = 0;
			animationFrame = null;
		} else {
			animationFrame = requestAnimationFrame(step);
		}
	}

	function startAnimation() {
		if (animationFrame === null) {
			animationFrame = requestAnimationFrame(step);
		}
	}

	return {
		get current() {
			return current;
		},
		get velocity() {
			return velocity;
		},
		get target() {
			return target;
		},
		set target(value: T) {
			target = value;
			startAnimation();
		},
		set(value: T, initialVelocity?: number) {
			target = value;
			if (initialVelocity !== undefined) {
				velocity = initialVelocity;
			}
			startAnimation();
		},
		snap(value: T) {
			if (animationFrame !== null) {
				cancelAnimationFrame(animationFrame);
				animationFrame = null;
			}
			current = value;
			target = value;
			velocity = 0;
		},
		stop() {
			if (animationFrame !== null) {
				cancelAnimationFrame(animationFrame);
				animationFrame = null;
			}
		}
	};
}

/**
 * Creates a physics spring that follows a reactive source.
 */
export function physicsSpringFrom<T extends number>(
	fn: () => T,
	options: PhysicsSpringOptions = {}
): PhysicsSpringValue<T> {
	const spring = physicsSpring(fn(), options);

	$effect(() => {
		const newTarget = fn();
		if (newTarget !== spring.target) {
			spring.target = newTarget;
		}
	});

	return spring;
}

// ============================================================================
// Momentum-preserving Spring (for gestures)
// ============================================================================

export type MomentumSpringOptions = PhysicsSpringOptions & {
	/** How long to preserve momentum in ms. Default: 800 */
	momentumDuration?: number;
	/** Friction coefficient for momentum decay. Default: 0.95 */
	friction?: number;
};

export type MomentumSpringValue<T extends number = number> = PhysicsSpringValue<T> & {
	/** Release with current velocity (for fling gestures) */
	release(targetOrVelocity?: T | { velocity: number }): void;
};

/**
 * Creates a spring optimized for gesture interactions.
 * Supports momentum preservation for fling gestures.
 *
 * @example
 * ```svelte
 * <script>
 *   import { momentumSpring } from '$lib/motion';
 *
 *   const x = momentumSpring(0, {
 *     stiffness: 200,
 *     damping: 20,
 *     momentumDuration: 800
 *   });
 *
 *   function onDragEnd(event) {
 *     // Release with velocity from drag gesture
 *     x.release({ velocity: event.velocity.x });
 *   }
 * </script>
 * ```
 */
export function momentumSpring<T extends number>(
	initial: T,
	options: MomentumSpringOptions = {}
): MomentumSpringValue<T> {
	const { momentumDuration = 800, friction = 0.95, ...springOptions } = options;

	const spring = physicsSpring(initial, springOptions);

	// Can't use spread because it loses getters - must delegate explicitly
	return {
		get current() {
			return spring.current;
		},
		get velocity() {
			return spring.velocity;
		},
		get target() {
			return spring.target;
		},
		set target(value: T) {
			spring.target = value;
		},
		set: spring.set.bind(spring),
		snap: spring.snap.bind(spring),
		stop: spring.stop.bind(spring),
		release(targetOrVelocity) {
			if (targetOrVelocity === undefined) {
				// Just let current velocity play out
				return;
			}

			if (typeof targetOrVelocity === 'object' && 'velocity' in targetOrVelocity) {
				// Release with given velocity, project where it will land
				const vel = targetOrVelocity.velocity;
				// Project landing position based on velocity and friction
				const projectedDistance = (vel * momentumDuration) / 1000 * friction;
				const projectedTarget = (spring.current + projectedDistance) as T;
				spring.set(projectedTarget, vel);
			} else {
				// Release towards a target
				spring.target = targetOrVelocity;
			}
		}
	};
}

// Backwards compatibility aliases
export { momentumSpring as springWithMomentum };
