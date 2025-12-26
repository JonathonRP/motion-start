<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
import { getContext } from 'svelte';
import { get } from 'svelte/store';
import { MotionConfigContext } from '../context/MotionConfigContext.js';
import { UsePointerEvent } from '../events/use-pointer-event';
import { PanSession } from './PanSession';

let { props, visualElement, isCustom = false } = $props();

let { onPan, onPanStart, onPanEnd, onPanSessionStart } = $derived(props);
let hasPanEvents = $derived(onPan || onPanStart || onPanEnd || onPanSessionStart);
let panSession = $state<PanSession | null>(null);

const mcc = getContext(MotionConfigContext) || MotionConfigContext.get();
// @ts-expect-error
let { transformPagePoint } = $derived(get(mcc));

let handlers = $derived({
	onSessionStart: onPanSessionStart,
	onStart: onPanStart,
	onMove: onPan,
	onEnd: (event: any, info: any) => {
		panSession = null;
		onPanEnd && onPanEnd(event, info);
	},
});

function onPointerDown(event: PointerEvent) {
	panSession = new PanSession(event, handlers, {
		transformPagePoint,
	});
}

$effect(() => {
	if (panSession !== null) {
		panSession.updateHandlers(handlers);
	}
});

$effect(() => {
	return () => {
		panSession && panSession.end();
	};
});
</script>

<UsePointerEvent
  ref={visualElement}
  eventName="pointerdown"
  handler={hasPanEvents && onPointerDown}
>
  <slot />
</UsePointerEvent>
