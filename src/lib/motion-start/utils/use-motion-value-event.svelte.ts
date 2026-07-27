/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionValue, MotionValueEventCallbacks } from '../value/index.js';

export function useMotionValueEvent<V, EventName extends keyof MotionValueEventCallbacks<V>>(
	value: MotionValue<V> | (() => MotionValue<V>),
	event: EventName,
	callback: MotionValueEventCallbacks<V>[EventName]
) {
	const getValue = typeof value === 'function' ? value : () => value;

	$effect.pre(() => getValue().on(event, callback));
}
