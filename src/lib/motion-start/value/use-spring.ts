/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { fixed } from '../utils/fix-process-env';
import { beforeUpdate, getContext, tick } from 'svelte';
import { get } from 'svelte/store';
import type { MotionValue } from '../value';
import { isMotionValue } from './utils/is-motion-value';
import { useMotionValue } from './use-motion-value';
import { MotionConfigContext } from '../context/MotionConfigContext';
import type { SpringOptions } from '../animation/types';
import { frame, frameData } from '../frameloop';
import { type MainThreadAnimation, animateValue } from '../animation/animators/MainThreadAnimation';

function toNumber(v: string | number) {
	if (typeof v === 'number') return v;
	return Number.parseFloat(v);
}

/**
 * Creates a `MotionValue` that, when `set`, will use a spring animation to animate to its new state.
 *
 * It can either work as a stand-alone `MotionValue` by initialising it with a value, or as a subscriber
 * to another `MotionValue`.
 *
 * @remarks
 *
 * ```jsx
 * const x = useSpring(0, { stiffness: 300 })
 * const y = useSpring(x, { damping: 10 })
 * ```
 *
 * @param inputValue - `MotionValue` or number. If provided a `MotionValue`, when the input `MotionValue` changes, the created `MotionValue` will spring towards that value.
 * @param springConfig - Configuration options for the spring.
 * @returns `MotionValue`
 *
 * @public
 */
export const useSpring = (source: MotionValue | number, config: SpringOptions = {}, isCustom = false) => {
	const mcc = getContext<ReturnType<typeof MotionConfigContext>>(MotionConfigContext) || MotionConfigContext(isCustom);

	let activeSpringAnimation: MainThreadAnimation<number> | null = null;

	const value = useMotionValue(isMotionValue(source) ? toNumber(source.get()) : source) as MotionValue<number> & {
		reset: (_: MotionValue<number>, config: SpringOptions) => void;
	};

	let latestValue = value.get();
	let latestSetter: (v: number) => void = () => {};

	const startAnimation = () => {
		/**
		 * If the previous animation hasn't had the chance to even render a frame, render it now.
		 */
		const animation = activeSpringAnimation;

		if (animation && animation.time === 0) {
			animation.sample(frameData.delta);
		}

		stopAnimation();

		activeSpringAnimation = animateValue({
			keyframes: [value.get(), latestValue],
			velocity: value.getVelocity(),
			type: 'spring',
			restDelta: 0.001,
			restSpeed: 0.01,
			...config,
			onUpdate: latestSetter,
		});
	};

	const stopAnimation = () => {
		if (activeSpringAnimation) {
			activeSpringAnimation.stop();
		}
	};

	const update = (_config: typeof config) => {
		value.attach((v, set) => {
			const { isStatic } = get(mcc);

			if (isStatic) {
				return set(v);
			}

			latestValue = v;
			latestSetter = set;

			frame.update(startAnimation);

			return value.get();
		}, stopAnimation);
	};

	beforeUpdate(() => {
		update(config);
	});

	tick().then(() => {
		if (isMotionValue(source)) {
			return source.on('change', (v) => value.set(Number.parseFloat(v)));
		}
	});

	value.reset = (_value, _config) => update(_config);

	return value;
};
