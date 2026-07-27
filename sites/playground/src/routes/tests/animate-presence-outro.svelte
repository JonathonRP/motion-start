<script lang="ts">
import { AnimatePresence, motion } from 'motion-start';
import CustomMotionRoot from '../CustomMotionRoot.svelte';

let visible = $state(true);
let items = $state([0, 1]);
let direction = $state(1);
let completed = $state(0);
let longVisible = $state(true);
let waiting = $state('a');
let customVisible = $state(true);
let nestedVisible = $state(true);
let nestedExitOrder = $state<string[]>([]);
const MotionCustomRoot = motion.create(CustomMotionRoot);
</script>

<button id="toggle" onclick={() => (visible = !visible)}>Toggle</button>
<button id="remove" onclick={() => (items = items.slice(0, -1))}>Remove</button>
<button id="direction" onclick={() => (direction = -1)}>Direction</button>
<button id="remove-long" onclick={() => (longVisible = false)}>Remove long</button>
<button id="switch-wait" onclick={() => (waiting = 'b')}>Switch wait</button>
<button id="remove-custom" onclick={() => (customVisible = false)}>Remove custom</button>
<button id="remove-nested" onclick={() => (nestedVisible = false)}>Remove nested</button>
<output id="completed">{completed}</output>
<output id="nested-exit-order">{nestedExitOrder.join(',')}</output>

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

<AnimatePresence initial={false}>
	{#if nestedVisible}
		<motion.div
			id="nested-exit-parent"
			exit="exit"
			variants={{
				exit: {
					opacity: 0,
					transition: { duration: 0.1, when: 'afterChildren' },
				},
			}}
			onAnimationComplete={() => (nestedExitOrder = [...nestedExitOrder, 'parent'])}
		>
			<motion.div
				id="nested-exit-child"
				variants={{ exit: { opacity: 0, transition: { duration: 0.1 } } }}
				onAnimationComplete={() => (nestedExitOrder = [...nestedExitOrder, 'child'])}
			/>
		</motion.div>
	{/if}
</AnimatePresence>

<AnimatePresence>
	{#if customVisible}
		<MotionCustomRoot
			id="custom-exit"
			initial={false}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
			style={{ width: '20px', height: '20px', backgroundColor: 'purple' }}
		/>
	{/if}
</AnimatePresence>

<AnimatePresence>
	{#if longVisible}
		<motion.div
			id="long-exit"
			initial={false}
			exit={{ opacity: 0, transition: { duration: 0.8 } }}
			style={{ width: '20px', height: '20px', backgroundColor: 'green' }}
		/>
	{/if}
</AnimatePresence>

<AnimatePresence mode="wait">
	{#key waiting}
		<motion.div
			id="wait-{waiting}"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.8 }}
			style={{ width: '20px', height: '20px' }}
		/>
	{/key}
</AnimatePresence>
