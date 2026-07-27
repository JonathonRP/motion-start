<script lang="ts">
import { motion, visualElementStore } from 'motion-start';
import { onDestroy } from 'svelte';

let count = $state(0);
let portalNode: HTMLElement | null = null;
let parentNode: HTMLElement | null = null;

const size = $derived(count === 0 ? 100 : 300);

function portalRef(node: HTMLElement | null) {
	portalNode = node;
	if (node && node.parentElement !== document.body) {
		document.body.appendChild(node);
	}
}

function resizeParent() {
	// React's getSnapshotBeforeUpdate runs for both nodes before the parent
	// resizes. Svelte updates the parent DOM before propagating an unchanged
	// portal child's props, so take the equivalent snapshots at mutation time.
	if (parentNode) {
		visualElementStore.get(parentNode)?.projection?.willUpdate();
	}
	if (portalNode) {
		visualElementStore.get(portalNode)?.projection?.willUpdate();
	}
	count++;
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
	ref={(node) => (parentNode = node)}
	onclick={resizeParent}
	transition={{ duration: 10, ease: () => 0.5 }}
>
	<!-- React rerenders the portal child when count changes. The keyed Svelte
	     child is otherwise unchanged, so expose the same commit explicitly. -->
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
