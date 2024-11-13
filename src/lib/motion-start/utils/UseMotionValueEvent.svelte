<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script
	lang="ts"
	generics="V, EventName extends keyof MotionValueEventCallbacks<V>"
>
	import { beforeUpdate } from "svelte";
	import type { MotionValue, MotionValueEventCallbacks } from "../value";

	export let value: MotionValue<V>,
		event: EventName,
		callback: MotionValueEventCallbacks<V>[EventName];

	const memo = (
		_value?: typeof value | undefined,
		_event?: typeof event | undefined,
		_callback?: typeof callback | undefined,
	) => value.on(event, callback);

	/**
	 * useInsertionEffect will create subscriptions before any other
	 * effects will run. Effects run upwards through the tree so it
	 * can be that binding a useLayoutEffect higher up the tree can
	 * miss changes from lower down the tree.
	 */
	beforeUpdate(() => memo());

	$: memo(value, event, callback);
</script>

<slot />
