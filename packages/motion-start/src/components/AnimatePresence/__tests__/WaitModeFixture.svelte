<svelte:options runes={true} />

<script lang="ts">
import { motion } from '../../../index.js';
import AnimatePresence from '../AnimatePresence.svelte';

let { mode = 'wait' as 'sync' | 'wait' | 'popLayout', variant = 'html' as 'html' | 'svg' | 'absolute' | 'nested' } =
	$props();

let step = $state(0);
</script>

<button id="advance" onclick={() => (step += 1)}>advance</button>

<div id="host">
	<AnimatePresence {mode}>
		{#key step}
			{#if variant === 'svg'}
				<motion.svg
					class="page"
					data-step={step}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.05 }}
				></motion.svg>
			{:else if variant === 'absolute'}
				<motion.div
					class="page"
					data-step={step}
					style={{ position: 'absolute' }}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.05 }}
				></motion.div>
			{:else if variant === 'nested'}
				<motion.div
					class="page"
					data-step={step}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.05 }}
				>
					<motion.div class="nested" whileHover={{ scale: 1.1 }}></motion.div>
				</motion.div>
			{:else}
				<motion.div
					class="page"
					data-step={step}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.05 }}
				></motion.div>
			{/if}
		{/key}
	</AnimatePresence>
</div>
