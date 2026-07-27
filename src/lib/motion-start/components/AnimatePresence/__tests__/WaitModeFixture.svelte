<script lang="ts">
import { motion } from '../../../index.js';
import AnimatePresence from '../AnimatePresence.svelte';

let { mode = 'wait' as 'sync' | 'wait' | 'popLayout' } = $props();

let step = $state(0);
</script>

<button id="advance" onclick={() => (step += 1)}>advance</button>

<div id="host">
	<AnimatePresence {mode}>
		{#key step}
			<motion.div
				class="page"
				data-step={step}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.05 }}
			></motion.div>
		{/key}
	</AnimatePresence>
</div>
