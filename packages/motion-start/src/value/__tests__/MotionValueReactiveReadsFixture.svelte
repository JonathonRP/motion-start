<svelte:options runes />

<script lang="ts">
import type { MotionValue } from '../index.js';

interface Props {
	value: MotionValue<number>;
	oncurrent: (latest: number) => void;
	onget: (latest: number) => void;
}

let { value, oncurrent, onget }: Props = $props();

$effect(() => {
	oncurrent(value.current);
});

$effect(() => {
	onget(value.get());
});
</script>
