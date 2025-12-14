/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionValue } from '.';
import { cancelFrame, frame } from '../frameloop';
import { useMotionValue } from './use-motion-value.svelte';

export const useCombineMotionValues = <R>(combineValues: () => R) => {
	const value = useMotionValue(combineValues());

	const updateValue = () => {
		value.set(combineValues());
	};

	const scheduleUpdate = () => frame.preRender(updateValue, false, true);
	let subscriptions: VoidFunction[];

	const unsubscribe = () => {
		subscriptions.forEach((unsubscribe) => unsubscribe());
		cancelFrame(updateValue);
	};

	const subscribe = (values: MotionValue<any>[]) => {
		subscriptions = values.map((v) => v.on('change', scheduleUpdate));

		return unsubscribe;
	};

	$effect(() => unsubscribe)

	return { value, subscribe, updateValue };
};
