/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { fixed } from '../utils/fix-process-env.js';
import sync, { getFrameData } from 'framesync';
import { velocityPerSecond } from 'popmotion';
import { SubscriptionManager } from '../utils/subscription-manager.js';
/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { Writable, Unsubscriber } from 'svelte/store';
export type Transformer<T> = (v: T) => T;
/**
 * @public
 */
export type Subscriber<T> = (v: T) => void;
/**
 * @public
 */
export type PassiveEffect<T> = (v: T, safeSetter: (v: T) => void) => void;
export type StartAnimation = (complete: () => void) => (() => void) | undefined;
/**
 * `MotionValue` is used to track the state and velocity of motion values.
 *
 * @public
 */
export class MotionValue<V = any> implements Writable<V> {
	/**
	 * Subscribe method to make MotionValue compatible with Svelte store. Returns a unsubscribe function.
	 * Same as onChange.
	 *
	 * @public
	 */
	subscribe(this: void & MotionValue<V>, subscription: Subscriber<V>): Unsubscriber {
		return this.onChange(subscription);
	}
	/**
	 * Update method to make MotionValue compatible with Svelte writable store
	 *
	 * @public
	 */
	update = (cb: (value: V) => V): void => {
		this.set(cb(this.get()));
	};
	/**
	 * The current state of the `MotionValue`.
	 *
	 * @internal
	 */
	private current: V;
	/**
	 * The previous state of the `MotionValue`.
	 *
	 * @internal
	 */
	private prev: V;
	/**
	 * Duration, in milliseconds, since last updating frame.
	 *
	 * @internal
	 */
	private timeDelta = 0;
	/**
	 * Timestamp of the last time this `MotionValue` was updated.
	 *
	 * @internal
	 */
	private lastUpdated = 0;
	/**
	 * Functions to notify when the `MotionValue` updates.
	 *
	 * @internal
	 */
	private updateSubscribers = new SubscriptionManager();
	/**
	 * Functions to notify when the velocity updates.
	 *
	 * @internal
	 */
	velocityUpdateSubscribers: SubscriptionManager<Subscriber<number>> = new SubscriptionManager();
	/**
	 * Functions to notify when the `MotionValue` updates and `render` is set to `true`.
	 *
	 * @internal
	 */
	private renderSubscribers = new SubscriptionManager();
	/**
	 * Add a passive effect to this `MotionValue`.
	 *
	 * A passive effect intercepts calls to `set`. For instance, `useSpring` adds
	 * a passive effect that attaches a `spring` to the latest
	 * set value. Hypothetically there could be a `useSmooth` that attaches an input smoothing effect.
	 *
	 * @internal
	 */
	private passiveEffect?: PassiveEffect<V>;
	/**
	 * A reference to the currently-controlling Popmotion animation
	 *
	 * @internal
	 */
	private stopAnimation?: (() => void) | null | undefined;
	/**
	 * Tracks whether this value can output a velocity. Currently this is only true
	 * if the value is numerical, but we might be able to widen the scope here and support
	 * other value types.
	 *
	 * @internal
	 */
	private canTrackVelocity = false;

	private onSubscription = () => {};
	private onUnsubscription = () => {};

	/**
	 * @param init - The initiating value
	 * @param startStopNotifier - a function that is called, once the first subscriber is added to this motion value.
	 *                            The return function is called, when the last subscriber unsubscribes.
	 *
	 * -  `transformer`: A function to transform incoming values with.
	 *
	 * @internal
	 */
	constructor(init: V, startStopNotifier?: () => () => void) {
		this.prev = this.current = init;
		this.canTrackVelocity = isFloat(this.current);

		if (startStopNotifier) {
			this.onSubscription = () => {
				if (
					this.updateSubscribers.getSize() +
						this.velocityUpdateSubscribers.getSize() +
						this.renderSubscribers.getSize() ===
					0
				) {
					const unsub = startStopNotifier();
					this.onUnsubscription = () => {};
					if (unsub) {
						this.onUnsubscription = () => {
							if (
								this.updateSubscribers.getSize() +
									this.velocityUpdateSubscribers.getSize() +
									this.renderSubscribers.getSize() ===
								0
							) {
								unsub();
							}
						};
					}
				}
			};
		}
	}
	/**
     * Adds a function that will be notified when the `MotionValue` is updated.
     *
     * It returns a function that, when called, will cancel the subscription.
     *
     * When calling `onChange` inside a React component, it should be wrapped with the
     * `useEffect` hook. As it returns an unsubscribe function, this should be returned
     * from the `useEffect` function to ensure you don't add duplicate subscribers..
     *
     
     * @motion
     *
     * ```jsx
     * <script>
     *   import { useMotionValue } from 'svelte-motion'
     * 
     *   const x = useMotionValue(0)
     *   const y = useMotionValue(0)
     *   const opacity = useMotionValue(1)
     *
     *   
     *   function updateOpacity() {
     *       const maxXY = Math.max(x.get(), y.get())
     *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
     *       opacity.set(newOpacity)
     *   }
     *   
     *   // framer-motion style:
     *   const unsubscribeX = x.onChange(updateOpacity)
     *   onDestroy(()=>{
     *       unsubscribeX()
     *   })
     *   // equivalent Svelte style. Subscription and un-subscription is automatically handled:
     *   $: updateOpacity($y)
     * </script>
     * 
     * <Motion let:motion style={{ x }}><div use:motion/></Motion>
     * ```
     *
     * @param subscriber - A function that receives the latest value.
     * @returns A function that, when called, will cancel this subscription.
     *
     * @public
     */
	onChange = (subscription: Subscriber<V>): (() => void) => {
		this.onSubscription();
		const unsub = this.updateSubscribers.add(subscription);
		return () => {
			unsub();
			this.onUnsubscription();
		};
	};
	clearListeners = (): void => {
		this.updateSubscribers.clear();
		this.onUnsubscription();
	};
	/**
	 * Adds a function that will be notified when the `MotionValue` requests a render.
	 *
	 * @param subscriber - A function that's provided the latest value.
	 * @returns A function that, when called, will cancel this subscription.
	 *
	 * @internal
	 */
	onRenderRequest = (subscription: Subscriber<V>): (() => void) => {
		this.onSubscription();
		// Render immediately
		subscription(this.get());
		const unsub = this.renderSubscribers.add(subscription);
		return () => {
			unsub();
			this.onUnsubscription();
		};
	};
	/**
	 * Attaches a passive effect to the `MotionValue`.
	 *
	 * @internal
	 */
	attach = (passiveEffect: PassiveEffect<V>): void => {
		this.passiveEffect = passiveEffect;
	};
	/**
	 * Sets the state of the `MotionValue`.
	 *
	 * @remarks
	 *
	 * ```jsx
	 * const x = useMotionValue(0)
	 * x.set(10)
	 * ```
	 *
	 * @param latest - Latest value to set.
	 * @param render - Whether to notify render subscribers. Defaults to `true`
	 *
	 * @public
	 */
	set = (v: V, render?: boolean): void => {
		if (render === void 0) {
			render = true;
		}
		if (!render || !this.passiveEffect) {
			this.updateAndNotify(v, render);
		} else {
			this.passiveEffect(v, this.updateAndNotify);
		}
	};
	updateAndNotify = (v: V, render?: boolean): void => {
		if (render === void 0) {
			render = true;
		}
		this.prev = this.current;
		this.current = v;
		// Update timestamp
		var _a = getFrameData(),
			delta = _a.delta,
			timestamp = _a.timestamp;
		if (this.lastUpdated !== timestamp) {
			this.timeDelta = delta;
			this.lastUpdated = timestamp;
			sync.postRender(this.scheduleVelocityCheck);
		}
		// Update update subscribers
		if (this.prev !== this.current) {
			this.updateSubscribers.notify(this.current);
		}
		// Update velocity subscribers
		if (this.velocityUpdateSubscribers.getSize()) {
			this.velocityUpdateSubscribers.notify(this.getVelocity());
		}
		// Update render subscribers
		if (render) {
			this.renderSubscribers.notify(this.current);
		}
	};
	/**
	 * Returns the latest state of `MotionValue`
	 *
	 * @returns - The latest state of `MotionValue`
	 *
	 * @public
	 */
	get = (): V => {
		this.onSubscription();
		const curr = this.current;
		this.onUnsubscription();
		return curr;
	};
	/**
	 * @public
	 */
	getPrevious = (): V => {
		return this.prev;
	};
	/**
	 * Returns the latest velocity of `MotionValue`
	 *
	 * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
	 *
	 * @public
	 */
	getVelocity = (): number => {
		// This could be isFloat(this.prev) && isFloat(this.current), but that would be wasteful
		this.onSubscription();
		const vel = this.canTrackVelocity
			? // These casts could be avoided if parseFloat would be typed better
				velocityPerSecond(
					Number.parseFloat(String(this.current)) - Number.parseFloat(String(this.prev)),
					this.timeDelta
				)
			: 0;
		this.onUnsubscription();
		return vel;
	};
	/**
	 * Schedule a velocity check for the next frame.
	 *
	 * This is an instanced and bound function to prevent generating a new
	 * function once per frame.
	 *
	 * @internal
	 */
	private scheduleVelocityCheck = () => {
		return sync.postRender(this.velocityCheck);
	};
	/**
	 * Updates `prev` with `current` if the value hasn't been updated this frame.
	 * This ensures velocity calculations return `0`.
	 *
	 * This is an instanced and bound function to prevent generating a new
	 * function once per frame.
	 *
	 * @internal
	 */
	private velocityCheck = (_a: { timestamp: any }) => {
		var timestamp = _a.timestamp;
		if (timestamp !== this.lastUpdated) {
			this.prev = this.current;
			this.velocityUpdateSubscribers.notify(this.getVelocity());
		}
	};
	hasAnimated = false;
	/**
	 * Registers a new animation to control this `MotionValue`. Only one
	 * animation can drive a `MotionValue` at one time.
	 *
	 * ```jsx
	 * value.start()
	 * ```
	 *
	 * @param animation - A function that starts the provided animation
	 *
	 * @internal
	 */
	start = (animation: StartAnimation): Promise<void> => {
		this.stop();
		return new Promise((resolve) => {
			this.hasAnimated = true;// @ts-expect-error
			this.stopAnimation = animation(resolve); 
		}).then(() => {
			return this.clearAnimation();
		});
	};
	/**
	 * Stop the currently active animation.
	 *
	 * @public
	 */
	stop = (): void => {
		if (this.stopAnimation) this.stopAnimation();
		this.clearAnimation();
	};
	/**
	 * Returns `true` if this value is currently animating.
	 *
	 * @public
	 */
	isAnimating = (): boolean => {
		return !!this.stopAnimation;
	};
	private clearAnimation = () => {
		this.stopAnimation = null;
	};
	/**
	 * Destroy and clean up subscribers to this `MotionValue`.
	 *
	 * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
	 * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
	 * created a `MotionValue` via the `motionValue` function.
	 *
	 * @public
	 */
	destroy = (): void => {
		this.updateSubscribers.clear();
		this.renderSubscribers.clear();
		this.stop();
		this.onUnsubscription();
	};
}

var isFloat = (value: unknown) => !isNaN(Number.parseFloat(value as string));

/**
 * @internal
 */
export function motionValue<V>(init: V, startStopNotifier?: () => () => void): MotionValue<V> {
	return new MotionValue(init, startStopNotifier);
}
