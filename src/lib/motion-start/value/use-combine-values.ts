/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import { frame } from '../frameloop/index.js';
import type { MotionValue } from '.';
import { motionValue } from '.';

export const useCombineMotionValues = <R>(values: (MotionValue | (() => R))[], combineValues: () => R) => {
	let subscriptions: (() => void)[] = [];
	let vals = values;

	const unsubscribe = () => {
		for (const unsubscribe of subscriptions) {
			unsubscribe();
		}
	};
	const subscribe = () => {
		subscriptions = vals.map((val) => (val as MotionValue).onChange(handler));
		updateValue();
	};
	const value = motionValue(combineValues(), () => {
		unsubscribe();
		subscribe();
		return unsubscribe;
	}) as MotionValue<R> & { reset: (values: MotionValue[], combineValues: () => R) => void };

	let updateValue = () => {
		value.set(combineValues());
	};

	const handler = () => {
		sync.update(updateValue, false, true);
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

	return value;
};
// export { default as UseCombineMotionValues } from "./UseCombineValues.svelte";
