/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { AnimationOptions } from 'popmotion';
import type { PermissiveTransitionDefinition, ResolvedValueTarget, Transition } from '../../types';
import type { MotionValue } from '../../value/index.js';

/** 
based on framer-motion@4.1.15,
Copyright (c) 2018 Framer B.V.
*/
import { animate, inertia } from 'popmotion';
import { getAnimatableNone } from '../../render/dom/value-types/animatable-none.js';
import { warning } from '../../utils/errors.js';
import { secondsToMilliseconds } from '../../utils/time-conversion.js';
import { getDefaultTransition } from './default-transitions.js';
import { easingDefinitionToFunction, isEasingArray } from './easing.js';
import { isAnimatable } from './is-animatable.js';

/**
 * Decide whether a transition is defined on a given Transition.
 * This filters out orchestration options and returns true
 * if any options are left.
 */
function isTransitionDefined(_a: Transition) {
	var {
		delay,
		when,
		delayChildren,
		staggerChildren,
		staggerDirection,
		repeat,
		repeatType,
		repeatDelay,
		from,
		...transition
	} = _a;
	return !!Object.keys(transition).length;
}
var legacyRepeatWarning = false;
/**
 * Convert Framer Motion's Transition type into Popmotion-compatible options.
 */
function convertTransitionToAnimationOptions<T>(_a: PermissiveTransitionDefinition): AnimationOptions<T> {
	var { ease, times, yoyo, flip, loop, ...transition } = _a;
	var options = Object.assign({}, transition);
	if (times) options.offset = times;
	/**
	 * Convert any existing durations from seconds to milliseconds
	 */
	if (transition.duration) options.duration = secondsToMilliseconds(transition.duration);
	if (transition.repeatDelay) options.repeatDelay = secondsToMilliseconds(transition.repeatDelay);
	/**
	 * Map easing names to Popmotion's easing functions
	 */
	if (ease) {
		options.ease = isEasingArray(ease) ? ease.map(easingDefinitionToFunction) : easingDefinitionToFunction(ease);
	}
	/**
	 * Support legacy transition API
	 */
	if (transition.type === 'tween') options.type = 'keyframes';
	/**
	 * TODO: These options are officially removed from the API.
	 */
	if (yoyo || loop || flip) {
		warning(
			!legacyRepeatWarning,
			'yoyo, loop and flip have been removed from the API. Replace with repeat and repeatType options.'
		);
		legacyRepeatWarning = true;
		if (yoyo) {
			options.repeatType = 'reverse';
		} else if (loop) {
			options.repeatType = 'loop';
		} else if (flip) {
			options.repeatType = 'mirror';
		}
		options.repeat = loop || yoyo || flip || transition.repeat;
	}
	/**
	 * TODO: Popmotion 9 has the ability to automatically detect whether to use
	 * a keyframes or spring animation, but does so by detecting velocity and other spring options.
	 * It'd be good to introduce a similar thing here.
	 */
	if (transition.type !== 'spring') options.type = 'keyframes';
	return options;
}
/**
 * Get the delay for a value by checking Transition with decreasing specificity.
 */
function getDelayFromTransition(transition: Transition, key: keyof Transition | 'layoutX' | 'layoutY' | '' | string) {
	var _a;
	var valueTransition = getValueTransition(transition, key) || {};
	return (_a = valueTransition.delay) !== null && _a !== void 0 ? _a : 0;
}
function hydrateKeyframes(options: PermissiveTransitionDefinition) {
	if (Array.isArray(options.to) && options.to[0] === null) {
		options.to = [...options.to];
		options.to[0] = options.from;
	}
	return options;
}
function getPopmotionAnimationOptions(transition: PermissiveTransitionDefinition, options: any, key: string) {
	var _a;
	if (Array.isArray(options.to)) {
		(_a = transition.duration) !== null && _a !== void 0 ? _a : (transition.duration = 0.8);
	}
	hydrateKeyframes(options);
	/**
	 * Get a default transition if none is determined to be defined.
	 */
	if (!isTransitionDefined(transition)) {
		transition = Object.assign(Object.assign({}, transition), getDefaultTransition(key, options.to));
	}
	return Object.assign(Object.assign({}, options), convertTransitionToAnimationOptions(transition));
}
/**
 *
 */
function getAnimation(
	key: string,
	value: MotionValue,
	target: ResolvedValueTarget,
	transition: Transition,
	onComplete: { (): void; (): void }
) {
	var _a;
	var valueTransition = getValueTransition(transition, key);
	var origin = (_a = valueTransition.from) !== null && _a !== void 0 ? _a : value.get();
	var isTargetAnimatable = isAnimatable(key, target);
	if (origin === 'none' && isTargetAnimatable && typeof target === 'string') {
		/**
		 * If we're trying to animate from "none", try and get an animatable version
		 * of the target. This could be improved to work both ways.
		 */
		origin = getAnimatableNone(key, target);
	} else if (isZero(origin) && typeof target === 'string') {
		origin = getZeroUnit(target);
	} else if (!Array.isArray(target) && isZero(target) && typeof origin === 'string') {
		target = getZeroUnit(origin);
	}
	var isOriginAnimatable = isAnimatable(key, origin);
	warning(
		isOriginAnimatable === isTargetAnimatable,
		'You are trying to animate ' +
			key +
			' from "' +
			origin +
			'" to "' +
			target +
			'". ' +
			origin +
			' is not an animatable value - to enable this animation set ' +
			origin +
			' to a value animatable to ' +
			target +
			' via the `style` property.'
	);
	function start() {
		var options = {
			from: origin,
			to: target,
			velocity: value.getVelocity(),
			onComplete: onComplete,
			onUpdate: (v: any) => value.set(v),
		};
		return valueTransition.type === 'inertia' || valueTransition.type === 'decay'
			? inertia(Object.assign(Object.assign({}, options), valueTransition))
			: animate(
					Object.assign(Object.assign({}, getPopmotionAnimationOptions(valueTransition, options, key)), {
						onUpdate: (v: any) => {
							var _a;
							options.onUpdate(v);
							(_a = valueTransition.onUpdate) === null || _a === void 0 ? void 0 : _a.call(valueTransition, v);
						},
						onComplete: () => {
							var _a;
							options.onComplete();
							(_a = valueTransition.onComplete) === null || _a === void 0 ? void 0 : _a.call(valueTransition);
						},
					})
				);
	}
	function set() {
		var _a;
		value.set(target);
		onComplete();
		(_a = valueTransition === null || valueTransition === void 0 ? void 0 : valueTransition.onComplete) === null ||
		_a === void 0
			? void 0
			: _a.call(valueTransition);
		return { stop: () => {} };
	}
	return !isOriginAnimatable || !isTargetAnimatable || valueTransition.type === false ? set : start;
}
function isZero(value: string | number) {
	return value === 0 || (typeof value === 'string' && Number.parseFloat(value) === 0 && value.indexOf(' ') === -1);
}
function getZeroUnit(potentialUnitType: string | number) {
	return typeof potentialUnitType === 'number' ? 0 : getAnimatableNone('', potentialUnitType);
}
function getValueTransition(transition: Transition, key: string) {
	const tran = transition as any;
	return tran[key] || tran.default || tran;
}
/**
 * Start animation on a MotionValue. This function is an interface between
 * Framer Motion and Popmotion
 *
 * @internal
 */
function startAnimation(key: string, value: MotionValue, target: ResolvedValueTarget, transition?: Transition) {
	if (transition === void 0) {
		transition = {};
	}
	return value.start((onComplete) => {
		var delayTimer: string | number | NodeJS.Timeout | undefined;
		var controls: { stop: any } | null | undefined;
		var animation = getAnimation(key, value, target, transition, onComplete);
		var delay = getDelayFromTransition(transition, key);
		var start = () => (controls = animation());
		if (delay) {
			delayTimer = setTimeout(start, secondsToMilliseconds(delay));
		} else {
			start();
		}
		return () => {
			clearTimeout(delayTimer);
			controls === null || controls === void 0 ? void 0 : controls.stop();
		};
	});
}

export {
	convertTransitionToAnimationOptions,
	getDelayFromTransition,
	getPopmotionAnimationOptions,
	getValueTransition,
	getZeroUnit,
	hydrateKeyframes,
	isTransitionDefined,
	isZero,
	startAnimation,
};
