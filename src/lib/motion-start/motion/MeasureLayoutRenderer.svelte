<script lang="ts" generics="MeasureProps extends Record<string, unknown>">
import type { Component } from 'svelte';

let {
	MeasureLayout,
	measureProps,
}: {
	MeasureLayout?: Component<MeasureProps>;
	measureProps: MeasureProps;
} = $props();
</script>

{#if MeasureLayout}
	<MeasureLayout {...measureProps} />
{/if}
