/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionValue, MotionValueEventCallbacks } from '../value';

export function useMotionValueEvent<V, EventName extends keyof MotionValueEventCallbacks<V>>(
	value: MotionValue<V>,
	event: EventName,
	callback: MotionValueEventCallbacks<V>[EventName]
) {
	const unlisten = value.on(event, callback);

	$effect(() => unlisten);

	return unlisten;
}
