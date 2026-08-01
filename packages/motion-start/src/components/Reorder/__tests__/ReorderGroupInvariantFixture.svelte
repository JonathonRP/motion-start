<script lang="ts">
import Group from '../Group.svelte';

let values = $state<string[] | undefined>(['alpha']);
</script>

<button data-testid="remove-values" onclick={() => (values = undefined)}>remove values</button>

<Group values={values!}>
	{#snippet children({ item })}
		<span>{item}</span>
	{/snippet}
</Group>
