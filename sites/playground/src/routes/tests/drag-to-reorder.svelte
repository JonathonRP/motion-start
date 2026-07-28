<script lang="ts">
    import { Reorder } from 'motion-start';
    import DragToReorderItem from './drag-to-reorder-item.svelte';
    import { page } from '$app/state';

    const axis = $derived.by<'x' | 'y'>(() => page.url.searchParams.get('axis') === 'x' ? 'x' : 'y');

    const initialItems = ['Tomato', 'Cucumber', 'Mustard', 'Chicken'];
    let items = $state([...initialItems]);

    function handleReorder(newItems: string[]) {
        items = newItems;
    }
</script>

<Reorder.Group
    axis={axis}
    onReorder={handleReorder}
    style={axis === 'y' ? {} : { display: 'flex' }}
    values={items}
>
    {#snippet children({ item })}
        <DragToReorderItem {item} {axis} />
    {/snippet}
</Reorder.Group>

<style>
    :global(body) {
        width: 100vw;
        height: 100vh;
        background: #ffaa00;
        overflow: hidden;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    :global(ul), :global(li) {
        list-style: none;
        padding: 0;
        margin: 0;
        font-family: GT Walsheim, sans-serif;
        font-weight: 700;
        font-size: 24px;
        line-height: 28px;
        box-sizing: content-box;
    }

    :global(ul) {
        position: relative;
        width: 300px;
    }

    :global(li) {
        border-radius: 10px;
        margin-bottom: 10px;
        width: 100%;
        padding: 20px;
        position: relative;
        background: white;
        border-radius: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
    }

    :global(li svg) {
        width: 18px;
        height: 18px;
        cursor: grab;
    }
</style>
