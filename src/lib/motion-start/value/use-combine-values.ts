/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { MotionValue } from '.';

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import sync from 'framesync';
import { motionValue } from '.';

export const useCombineMotionValues = <R>(values: MotionValue[], combineValues: () => R) => {
	let subscriptions: (() => void)[] = [];
	let vals = values;

	const unsubscribe = () => {
		for (const unsubscribe of subscriptions) {
			unsubscribe();
		}
	};
	const subscribe = () => {
		subscriptions = vals.map((val) => val.onChange(handler));
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
