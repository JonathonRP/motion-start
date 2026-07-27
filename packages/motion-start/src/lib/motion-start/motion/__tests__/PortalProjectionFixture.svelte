<script lang="ts">
import { onDestroy } from 'svelte';
import { motion } from '../../index.js';

let portalNode: HTMLElement | null = null;

// biome-ignore lint/correctness/noUnusedVariables: Used by the motion component's ref prop.
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

<motion.div id="portal-parent" layout>
	<motion.div
		id="portal-child"
		layout
		data-framer-portal-id="portal-parent"
		ref={portalRef}
	/>
</motion.div>
