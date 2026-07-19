<script lang="ts">
import type { Attachment } from 'svelte/attachments';
import type { RefObject } from '../../utils/safe-react-types.js';
import { useDomEvent } from '../use-dom-event.svelte.js';

let firstTarget = $state<HTMLElement | null>(null);
let secondTarget = $state<HTMLElement | null>(null);
let target = $state<EventTarget | null>(null);
let useSecondHandler = $state(false);
let firstCalls = $state(0);
let secondCalls = $state(0);
const captureFirst: Attachment<HTMLElement> = (node) => {
	firstTarget = node;
	return () => {
		if (firstTarget === node) firstTarget = null;
	};
};
const captureSecond: Attachment<HTMLElement> = (node) => {
	secondTarget = node;
	return () => {
		if (secondTarget === node) secondTarget = null;
	};
};

const ref: RefObject<EventTarget> = {
	get current() {
		return target ?? firstTarget;
	},
};

useDomEvent(ref, 'pointerdown', () => {
	if (useSecondHandler) secondCalls++;
	else firstCalls++;
});
</script>

<button id="replace-dom-handler" onclick={() => (useSecondHandler = true)}>replace</button>
<button id="retarget-dom-event" onclick={() => (target = secondTarget)}>retarget</button>
<output id="first-dom-calls">{firstCalls}</output>
<output id="second-dom-calls">{secondCalls}</output>
<div id="first-dom-target" {@attach captureFirst}></div>
<div id="second-dom-target" {@attach captureSecond}></div>
