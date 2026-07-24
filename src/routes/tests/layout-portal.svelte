<script lang="ts">
import { motion } from '$lib/motion-start';
import { onDestroy } from 'svelte';

let count = $state(0);
let portalNode: HTMLElement | null = null;

const size = $derived(count === 0 ? 100 : 300);

function portalRef(node: HTMLElement | null) {
	portalNode = node;
	if (node && node.parentElement !== document.body) {
		document.body.appendChild(node);
	}
}

onDestroy(() => {
	portalNode?.remove();
});
</script>

<motion.div
	id="parent"
	layout
	style={{
		background: 'red',
		width: size + 'px',
		height: size + 'px',
	}}
	onclick={() => count++}
	transition={{ duration: 10, ease: () => 0.5 }}
>
	<motion.div
		id="child"
		layout
		style={{ width: '100px', height: '100px', background: 'blue' }}
		transition={{ duration: 10, ease: () => 0.5 }}
		data-framer-portal-id="parent"
		layoutDependency={count}
		ref={portalRef}
	/>
</motion.div>
