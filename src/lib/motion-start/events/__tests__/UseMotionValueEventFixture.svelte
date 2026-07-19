<script lang="ts">
import { untrack } from 'svelte';
import type { MotionValue } from '../../value/index.js';
import { useMotionValueEvent } from '../../utils/use-motion-value-event.svelte.js';

interface Props {
	value: MotionValue<number>;
	handler: (latest: number) => void;
}

let { value, handler }: Props = $props();

useMotionValueEvent(
	untrack(() => value),
	'change',
	untrack(() => handler)
);
</script>
