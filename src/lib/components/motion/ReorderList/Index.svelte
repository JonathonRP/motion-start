<!-- https://codesandbox.io/p/sandbox/uonye -->
<script lang="ts">
    import { Reorder } from "$lib/motion-start";
    import Item from "./Item.svelte";
    import Box from "../../Box.svelte";

    let items = $state(["🍅 Tomato", "🥒 Cucumber", "🧀 Cheese", "🥬 Lettuce"]);
</script>

<Box>
    <Reorder.Group
        class="list-none p-0 m-0 font-medium text-2xl relative w-[300px]"
        axis="y"
        values={items}
        onReorder={(reorderedItems) => {
            console.log("reordered", reorderedItems);
            items = reorderedItems();
        }}
    >
        {#each items as item (item)}
            <Item {item} />
        {/each}
    </Reorder.Group>
</Box>
