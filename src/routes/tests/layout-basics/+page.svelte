<script lang="ts">
    let showPresence = false;
    let items: number[] = [1, 2, 3];
    let wide = false;
    const add = () => (items = [...items, items.length + 1]);
    const remove = () =>
        (items = items.slice(0, Math.max(0, items.length - 1)));
    const resize = () => (wide = !wide);
</script>

<div class="space-y-6 p-6">
    <h1 id="title" class="text-xl font-bold">Layout Basics</h1>
    <div class="space-x-3">
        <button id="resize" on:click={resize} class="px-3 py-1 border"
            >Resize Box</button
        >
        <button id="add" on:click={add} class="px-3 py-1 border"
            >Add Item</button
        >
        <button id="remove" on:click={remove} class="px-3 py-1 border"
            >Remove Item</button
        >
        <button
            id="presence-toggle"
            on:click={() => (showPresence = !showPresence)}
            class="px-3 py-1 border">Toggle Presence</button
        >
    </div>

    <div class="h-24">
        <div
            id="layout-box"
            style={`height:96px;width:${wide ? 320 : 160}px;background:${wide ? "#88f" : "#8f8"}`}
            class="border"
        />
    </div>

    <div id="list" class="flex gap-2">
        {#each items as i (i)}
            <div class="item border px-3 py-2">Item {i}</div>
        {/each}
    </div>

    <div class="h-24">
        {#if showPresence}
            <div id="presence-box" class="border px-3 py-2">Presence</div>
        {/if}
    </div>
</div>
