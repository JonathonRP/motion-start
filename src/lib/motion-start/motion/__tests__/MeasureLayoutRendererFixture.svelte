<script lang="ts">
	import MeasureLayoutRenderer from '../MeasureLayoutRenderer.svelte';
	import MeasureLayoutProbe from './MeasureLayoutProbe.svelte';

	interface Props {
		onmount: () => void;
		ondestroy: () => void;
	}

	let { onmount, ondestroy }: Props = $props();
	let enabled = $state(true);
	let value = $state(0);
</script>

<button onclick={() => (enabled = !enabled)}>toggle</button>
<button onclick={() => value++}>update</button>

<MeasureLayoutRenderer
	MeasureLayout={enabled ? MeasureLayoutProbe : undefined}
	measureProps={{ onmount, ondestroy, value }}
/>
