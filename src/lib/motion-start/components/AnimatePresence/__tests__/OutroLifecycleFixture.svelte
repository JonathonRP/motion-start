<script lang="ts">
import { motion } from '../../../index.js';
import AnimatePresence from '../AnimatePresence.svelte';

let exitVisible = $state(true);
let layoutVisible = $state(true);
</script>

<button id="remove-exit" onclick={() => (exitVisible = false)}>remove exit</button>
<button id="remove-layout" onclick={() => (layoutVisible = false)}>remove layout</button>

<AnimatePresence>
	{#if exitVisible}
		<motion.div
			id="exit-target"
			initial={false}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.05 }}
			style={{ opacity: 1, width: '100px' }}
		/>
	{/if}
</AnimatePresence>

<AnimatePresence>
	{#if layoutVisible}
		<motion.div
			id="layout-exit-target"
			initial={false}
			layoutId="shared"
			transition={{ duration: 0.05 }}
			style={{ width: '100px' }}
		/>
	{/if}
</AnimatePresence>
