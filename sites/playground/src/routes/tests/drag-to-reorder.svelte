<script lang="ts">
    import { Reorder } from 'motion-start';
    import DragToReorderItem from './drag-to-reorder-item.svelte';
    import { page } from '$app/state';

    const axis = $derived.by<'x' | 'y'>(() => page.url.searchParams.get('axis') === 'x' ? 'x' : 'y');
    const useLayoutId = $derived(page.url.searchParams.has('layoutId'));
    const freeDrag = $derived(page.url.searchParams.has('freeDrag'));
    const invalidateOnDrag = $derived(page.url.searchParams.has('invalidateOnDrag'));
    const objectValues = $derived(page.url.searchParams.has('objectValues'));

    interface ReorderItem {
        id: string;
        label: string;
        order: number;
    }

    const initialItems = ['Tomato', 'Cucumber', 'Mustard', 'Chicken'];
    let items = $state([...initialItems]);
    let objectItems = $state<ReorderItem[]>([
        { id: 'Tomato', label: 'Tomato', order: 0 },
        { id: 'Cucumber', label: 'Cucumber', order: 1 },
        { id: 'Mustard', label: 'Mustard', order: 2 },
        { id: 'Chicken', label: 'Chicken', order: 3 },
    ]);
    let dragVersion = $state(0);

    function handleReorder(newItems: string[]) {
        items = newItems;
    }

    function handleObjectReorder(newItems: ReorderItem[]) {
        newItems.forEach((item, order) => {
            item.order = order;
        });
    }

    const orderedObjectItems = () => objectItems.toSorted((a, b) => a.order - b.order);
</script>

{#if objectValues}
    <Reorder.Group
        axis={axis}
        onReorder={handleObjectReorder}
        style={axis === 'y' ? {} : { display: 'flex' }}
        values={orderedObjectItems()}
        data-drag-version={dragVersion}
    >
        {#snippet children({ item })}
            <DragToReorderItem
                item={item.label}
                reorderValue={item}
                {axis}
                {useLayoutId}
                {freeDrag}
                onDragInvalidate={invalidateOnDrag ? () => dragVersion++ : undefined}
            />
        {/snippet}
    </Reorder.Group>
{:else}
    <Reorder.Group
        axis={axis}
        onReorder={handleReorder}
        style={axis === 'y' ? {} : { display: 'flex' }}
        values={items}
        data-drag-version={dragVersion}
    >
        {#snippet children({ item })}
            <DragToReorderItem
                {item}
                {axis}
                {useLayoutId}
                {freeDrag}
                onDragInvalidate={invalidateOnDrag ? () => dragVersion++ : undefined}
            />
        {/snippet}
    </Reorder.Group>
{/if}

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
