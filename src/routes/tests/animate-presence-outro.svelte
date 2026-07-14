<script lang="ts">
import { AnimatePresence, motion } from '$lib/motion-start';

let visible = $state(true);
let items = $state([0, 1]);
let direction = $state(1);
let completed = $state(0);
</script>

<button id="toggle" onclick={() => (visible = !visible)}>Toggle</button>
<button id="remove" onclick={() => (items = items.slice(0, -1))}>Remove</button>
<button id="direction" onclick={() => (direction = -1)}>Direction</button>
<output id="completed">{completed}</output>

<AnimatePresence custom={direction} onExitComplete={() => completed++}>
	{#if visible}
		<motion.div
			id="conditional"
			initial={false}
			exit="exit"
			variants={{ exit: (custom: number) => ({ opacity: 0, x: custom * 20 }) }}
			transition={{ duration: 0.3 }}
			style={{ width: '20px', height: '20px', backgroundColor: 'red' }}
		/>
	{/if}

	{#each items as item (item)}
		<motion.div
			id="item-{item}"
			initial={false}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.1 }}
			style={{ width: '20px', height: '20px', backgroundColor: 'blue' }}
		/>
	{/each}
</AnimatePresence>
