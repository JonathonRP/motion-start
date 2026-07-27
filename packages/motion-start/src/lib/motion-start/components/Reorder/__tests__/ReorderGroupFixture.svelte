<script lang="ts">
import Group from '../Group.svelte';
import type { ReorderContext } from '../types.js';
import ReorderContextProbe from './ReorderContextProbe.svelte';

interface Props {
	onReorder: (values: string[]) => void;
	oncontext: (context: ReorderContext<string> | null) => void;
}

let { onReorder, oncontext }: Props = $props();

let values = $state(['a', 'b', 'c', 'd']);

function remove(value: string) {
	values = values.filter((entry) => entry !== value);
}
</script>

<button data-testid="remove-c" onclick={() => remove('c')}>remove c</button>

<Group {values} {onReorder}>
	{#snippet children({ item, id })}
		{#if id === 0}
			<ReorderContextProbe {oncontext} />
		{/if}
		<span data-testid="item-{item}">{item}</span>
	{/snippet}
</Group>
