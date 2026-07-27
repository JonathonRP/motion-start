<script lang="ts">
import { untrack } from 'svelte';
import type { MotionValue } from '../../value/index.js';
import { useMotionValueEvent } from '../../utils/use-motion-value-event.svelte.js';

interface Props {
	first: MotionValue<number>;
	second: MotionValue<number>;
	handler: (latest: number) => void;
}

let { first, second, handler }: Props = $props();
let current = $state.raw(untrack(() => first));

useMotionValueEvent(
	() => current,
	'change',
	(latest) => handler(latest)
);
</script>

<button id="switch-motion-value" onclick={() => (current = second)}>switch</button>
