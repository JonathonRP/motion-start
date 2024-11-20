/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { beforeUpdate } from 'svelte';
import type { MotionValue, MotionValueEventCallbacks } from '../value';

export function useMotionValueEvent<V, EventName extends keyof MotionValueEventCallbacks<V>>(
	value: MotionValue<V>,
	event: EventName,
	callback: MotionValueEventCallbacks<V>[EventName]
) {
	/**
	 * useInsertionEffect will create subscriptions before any other
	 * effects will run. Effects run upwards through the tree so it
	 * can be that binding a useLayoutEffect higher up the tree can
	 * miss changes from lower down the tree.
	 */
	beforeUpdate(() => value.on(event, callback));
}
