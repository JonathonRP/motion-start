<svelte:options runes={true} />

<script lang="ts">
import Group from '../Group.svelte';
import Item from '../Item.svelte';

interface Props {
	withItem?: boolean;
}

let { withItem = false }: Props = $props();

const values = ['alpha'];
</script>

<Group {values}>
	{#snippet children({ item })}
		{#if withItem}
			<Item value={item}>
				{#snippet children()}
					<span data-testid="item-content">{item}</span>
				{/snippet}
			</Item>
		{:else}
			<span data-testid="group-content">{item}</span>
		{/if}
	{/snippet}
</Group>
