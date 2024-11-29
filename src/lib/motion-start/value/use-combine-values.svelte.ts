/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionValue } from '.';
import { motionValue } from '.';
import { cancelFrame, frame } from '../frameloop';

export const useCombineMotionValues = <R>(values: MotionValue[], combineValues: () => R) => {
	let subscriptions: (() => void)[] = [];
	let vals = values;

	const unsubscribe = () => {
		for (const unsubscribe of subscriptions) {
			unsubscribe();
		}
	};
	const subscribe = () => {
		subscriptions = vals.map((val) => val.on('change', handler));
		updateValue();
	};
	const value = motionValue(combineValues(), {
		startStopNotifier: () => {
			unsubscribe();
			subscribe();
			return unsubscribe;
		},
	}) as MotionValue<R> & { reset: (values: MotionValue[], combineValues: () => R) => void };

	let updateValue = () => {
		value.set(combineValues());
	};

	const handler = () => {
		frame.update(updateValue, false, true);
	};

	value.reset = (_values, _combineValues) => {
		vals = _values;
		//cleanup and reset
		unsubscribe();
		updateValue = () => {
			value.set(_combineValues());
		};
		subscribe();
	};

	$effect(() => {
		const scheduleUpdate = () => frame.preRender(updateValue, false, true);
		const subscriptions = values.map((v) => v.on('change', scheduleUpdate));

		return () => {
			subscriptions.forEach((unsubscribe) => unsubscribe());
			cancelFrame(updateValue);
		};
	});

	return value;
};
