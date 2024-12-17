/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionValue } from './index.svelte';
import { cancelFrame, frame } from '../frameloop';
import { useMotionValue } from './use-motion-value.svelte';

export const useCombineMotionValues = <R>(values: MotionValue[], combineValues: () => R) => {
	const value = useMotionValue(combineValues());

	const updateValue = () => {
		value.set(combineValues());
	};

	$effect(() => {
		updateValue();
	});

	$effect.pre(() => {
		const scheduleUpdate = () => frame.preRender(updateValue, false, true);
		const subscriptions = values.map((v) => v.on('change', scheduleUpdate));

		return () => {
			subscriptions.forEach((unsubscribe) => unsubscribe());
			cancelFrame(updateValue);
		};
	});

	return value;
};
