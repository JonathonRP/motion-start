<svelte:options runes={true} />

<script lang="ts">
import { motion } from '../../../index.js';
import AnimatePresence from '../AnimatePresence.svelte';

let { order }: { order: string[] } = $props();
let visible = $state(true);
</script>

<button id="remove-nested" onclick={() => (visible = false)}>remove nested</button>

<AnimatePresence initial={false}>
	{#if visible}
		<motion.div
			id="nested-exit-parent"
			exit="exit"
			variants={{
				exit: {
					opacity: 0,
					transition: { duration: 0.1, when: 'afterChildren' },
				},
			}}
			onAnimationComplete={() => order.push('parent')}
		>
			<motion.div
				id="nested-exit-child"
				variants={{ exit: { opacity: 0, transition: { duration: 0.1 } } }}
				onAnimationComplete={() => order.push('child')}
			/>
		</motion.div>
	{/if}
</AnimatePresence>
