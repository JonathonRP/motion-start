/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { fromStore } from 'svelte/store';
import type { MotionValue } from '.';
import { isMotionValue } from './utils/is-motion-value';
import { useMotionValue } from './use-motion-value.svelte';
import { useContext } from '../context/utils/context.svelte';
import { MotionConfigContext } from '../context/MotionConfigContext';
import type { SpringOptions } from '../animation/types';
import { frame, frameData } from '../frameloop';
import { type MainThreadAnimation, animateValue } from '../animation/animators/MainThreadAnimation.svelte';

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
export const useSpring = (source: MotionValue | number, config: SpringOptions = {}) => {
	const { isStatic } = fromStore(useContext(MotionConfigContext)).current;

	let activeSpringAnimation: MainThreadAnimation<number> | null = null;

	const value = $state(useMotionValue(isMotionValue(source) ? toNumber(source.get()) : source));

	let latestValue = $state(value.get());
	let latestSetter: (v: number) => void = $state(() => {});

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

	const insertEffect = (_config: typeof config) => () => {
		value.attach((v, set) => {
			if (isStatic) {
				return set(v);
			}

			latestValue = v;
			latestSetter = set;

			frame.update(startAnimation);

			return value.get();
		}, stopAnimation);
	};

	const layoutEffect = (_value: typeof value) => () => {
		if (isMotionValue(source)) {
			return source.on('change', (v) => value.set(Number.parseFloat(v)));
		}
	};

	$effect.pre(insertEffect(config));

	$effect.pre(layoutEffect(value));

	return value;
};
