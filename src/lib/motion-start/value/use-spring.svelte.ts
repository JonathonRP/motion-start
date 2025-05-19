/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { SpringOptions } from '../animation/types';
import { useContext } from '../context/use';
import { type MainThreadAnimation, animateValue } from '../animation/animators/MainThreadAnimation';
import { MotionConfigContext } from '../context/MotionConfigContext';
import { frame } from '../frameloop';
import type { MotionValue } from '.';
import { useMotionValue } from './use-motion-value.svelte';
import { isMotionValue } from './utils/is-motion-value';
import { noop } from '../utils/noop';

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
	const { isStatic } = $derived(useContext(MotionConfigContext).current);

	let activeSpringAnimation: MainThreadAnimation<number> | null = $state(null);

	const initialValue = isMotionValue(source) ? toNumber(source.get()) : source;

	const value = useMotionValue(initialValue);

	let latestValue = $state(initialValue);
	let latestSetter = $state<(v: number) => void>(noop);

	const startAnimation = () => {
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

	$effect(() => {
		$state.snapshot(config);
		return value.attach((v, set) => {
			if (isStatic) {
				return set(v);
			}

			latestValue = v;
			latestSetter = set;

			frame.postRender(startAnimation);

			return value.get();
		}, stopAnimation);
	});

	$effect(() => {
		if (isMotionValue(source)) {
			return source.on('change', (v) => value.set(Number.parseFloat(v)));
		}
	});

	return value;
};
