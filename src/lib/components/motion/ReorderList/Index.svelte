<!-- https://codesandbox.io/p/sandbox/uonye -->
<script lang="ts">
import { Reorder } from '$lib/motion-start';
import Box from '../../Box.svelte';
import Item from './Item.svelte';

let items = $state(['🍅 Tomato', '🥒 Cucumber', '🧀 Cheese', '🥬 Lettuce']);
</script>

<Box cls="dark:bg-ember-300 bg-amber-400">
    <Reorder.Group
        class="list-none p-0 m-0 font-medium text-2xl relative w-[300px]"
        axis="y"
        values={items}
        onReorder={(v) => {
            items = v;
        }}
    >
        {#snippet children({ item })}
            <Item {item} />
        {/snippet}
    </Reorder.Group>
</Box>
