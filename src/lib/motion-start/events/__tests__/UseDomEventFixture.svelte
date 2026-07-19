<script lang="ts">
import type { RefObject } from '../../utils/safe-react-types.js';
import { untrack } from 'svelte';
import { useDomEvent } from '../use-dom-event.svelte.js';

interface Props {
	eventTarget: EventTarget | null;
	handler?: EventListener;
	eventName?: string;
}

let { eventTarget, handler, eventName = 'pointerdown' }: Props = $props();

const ref: RefObject<EventTarget> = {
	get current() {
		return eventTarget;
	},
};

useDomEvent(
	ref,
	untrack(() => eventName),
	untrack(() => handler)
);
</script>
