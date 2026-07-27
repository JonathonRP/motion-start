<script lang="ts">
import { motion, visualElementStore } from 'motion-start';
import { SvelteMap } from 'svelte/reactivity';

function range(num: number) {
	return Array.from(Array(num).keys());
}

const sharedMotionProps = {
	layout: true,
	style: { background: 'red', width: '100%', height: '100px' },
	transition: {
		duration: 0.25,
		delay: 0.3,
		ease: [0.2, 0.0, 0.83, 0.83],
		layout: { duration: 0.3, ease: [0.2, 0.0, 0.83, 0.83] },
	},
};

let count = $state(0);
const itemNodes = new SvelteMap<number, HTMLElement>();

function setItemNode(item: number, node: HTMLElement | null) {
	if (node) {
		itemNodes.set(item, node);
	} else {
		itemNodes.delete(item);
	}
}

function commitCount(nextCount: number) {
	// React rerenders retained children before committing the new list. Svelte
	// reuses keyed children and propagates layoutDependency after insertion, so
	// capture their projection snapshots before mutating the list.
	for (const node of itemNodes.values()) {
		visualElementStore.get(node)?.projection?.willUpdate();
	}
	count = nextCount;
}
</script>

<div style="height: 50px;">
	<button id="add" onclick={() => commitCount(count + 1)}>Add item</button>
	<button id="reset" onclick={() => commitCount(0)}>Reset</button>
</div>
<div
	style="display: grid; grid-template-columns: repeat(auto-fill, minmax(127px, 1fr)); grid-gap: 10px; min-height: 100px; width: 500px;"
>
	{#each range(count).reverse() as i (i)}
		<!-- React rerenders every retained item when count changes. Svelte
		     reuses unchanged keyed children, so mirror that commit explicitly. -->
		<motion.div
			id={'box-' + i}
			{...sharedMotionProps}
			layoutDependency={count}
			ref={(node) => setItemNode(i, node)}
		>
			{i}
		</motion.div>
	{/each}
</div>
