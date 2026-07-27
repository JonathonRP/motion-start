<script lang="ts">
	import { motion, visualElementStore } from '../../index.js';

	let count = $state(1);
	let item: HTMLElement | null = null;

	function addItem() {
		if (item) visualElementStore.get(item)?.projection?.willUpdate();
		count++;
	}
</script>

<button id="add-layout-item" onclick={addItem}>add</button>
<div id="layout-list">
	{#each Array.from({ length: count }, (_, index) => index) as index (index)}
		<motion.div
			id={`layout-item-${index}`}
			layout
			layoutDependency={count}
			ref={(node) => {
				if (index === 0) item = node;
			}}
		/>
	{/each}
</div>
