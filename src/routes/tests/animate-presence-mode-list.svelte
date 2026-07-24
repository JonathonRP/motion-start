<script lang="ts">
import { AnimatePresence, motion } from '$lib/motion-start';

let popLayout = $state(false);
let items = $state([0, 1, 2, 3]);
const mode = $derived(popLayout ? 'popLayout' : 'sync');

function reset() {
	items = [0, 1, 2, 3];
	popLayout = false;
}

function removeFirst() {
	items = items.filter((item) => item !== 0);
}
</script>

<div style="padding: 40px; overflow: hidden;">
	<button id="reset" onclick={reset}>Reset</button>
	<label>
		<input id="pop-layout" type="checkbox" bind:checked={popLayout} />
		popLayout
	</label>
	<button id="remove-first" onclick={removeFirst}>Remove first</button>

	<ul style="position: relative; display: flex; width: 300px; height: 300px; flex-direction: column; gap: 20px; margin: 20px 0 0; padding: 0; list-style: none;">
		<AnimatePresence {mode}>
			{#each items as item (item)}
				<motion.li
					id="mode-item-{item}"
					layout
					style={{
						display: 'block',
						width: '300px',
						height: '80px',
						background: 'rgb(255, 40, 0)',
						borderRadius: '20px',
					}}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.8 }}
					transition={{ type: 'spring' }}
					onclick={() => {
						items = items.filter((value) => value !== item);
					}}
				/>
			{/each}
		</AnimatePresence>
	</ul>
</div>
