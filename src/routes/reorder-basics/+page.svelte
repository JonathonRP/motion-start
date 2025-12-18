<svelte:options runes={true} />

<script lang="ts">
    import { Reorder } from "$lib/motion-start/components/Reorder";
    let items = $state(["Alpha", "Bravo", "Charlie", "Delta"]);
    function onReorder(newOrder: string[]) {
        items = newOrder;
    }
</script>

<div class="container">
    <div data-testid="reorder-ready">ready</div>
    <h1>Phase F: Reorder Basics</h1>
    <p>Drag items to reorder. Verifies DOM order updates.</p>

    <Reorder.Group
        values={items}
        {onReorder}
        class="list"
        data-testid="reorder-group"
    >
        {#snippet children({ item })}
            <Reorder.Item
                value={item}
                class="item"
                data-testid={`item-${item}`}
            >
                <span class="handle" data-testid={`handle-${item}`}>⇅</span>
                <span class="label">{item}</span>
            </Reorder.Item>
        {/snippet}
    </Reorder.Group>

    <div class="order" data-testid="order">
        {items.join(",")}
    </div>
</div>

<style>
    .container {
        padding: 20px;
        max-width: 640px;
        margin: 0 auto;
    }
    h1 {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 12px;
    }
    .list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        background: #f9fafb;
    }
    .handle {
        cursor: grab;
        user-select: none;
    }
    .handle:active {
        cursor: grabbing;
    }
    .order {
        margin-top: 16px;
        font-family: monospace;
    }
</style>
