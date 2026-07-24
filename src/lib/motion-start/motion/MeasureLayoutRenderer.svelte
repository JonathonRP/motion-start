<script lang="ts" generics="MeasureProps extends Record<string, unknown>">
import type { Component } from 'svelte';

interface Props {
	MeasureLayout?: Component<MeasureProps>;
	measureProps: MeasureProps;
}

let { MeasureLayout, measureProps }: Props = $props();
</script>

{#if MeasureLayout}
	<MeasureLayout {...measureProps} />
{/if}
