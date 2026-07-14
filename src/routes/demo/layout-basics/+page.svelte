<script lang="ts">
let showPresence = $state(false);
let items: number[] = $state([1, 2, 3]);
let wide = $state(false);
const add = () => (items = [...items, items.length + 1]);
const remove = () => (items = items.slice(0, Math.max(0, items.length - 1)));
const resize = () => (wide = !wide);
</script>

<div class="space-y-6 p-6">
	<h1 id="title" class="text-xl font-bold">Layout Basics</h1>
	<div class="space-x-3">
		<button id="resize" onclick={resize} class="px-3 py-1 border">Resize Box</button>
		<button id="add" onclick={add} class="px-3 py-1 border">Add Item</button>
		<button id="remove" onclick={remove} class="px-3 py-1 border">Remove Item</button>
		<button
			id="presence-toggle"
			onclick={() => (showPresence = !showPresence)}
			class="px-3 py-1 border">Toggle Presence</button
		>
	</div>

	<div class="h-24">
		<div
			id="layout-box"
			style={'height:96px;width:' + (wide ? 320 : 160) + 'px;background:' + (wide ? '#88f' : '#8f8')}
			class="border"
		></div>
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
