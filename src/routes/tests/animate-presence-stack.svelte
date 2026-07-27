<script lang="ts">
import Card from '$lib/components/Card.svelte';
import { AnimatePresence } from '$lib/motion-start';

let index = $state(0);
let exitDirection = $state(250);
const cards = $derived([
	{ key: index, isFront: true },
	{ key: index + 1, isFront: false },
]);
</script>

<button id="dismiss-front-card" onclick={() => (index += 1)}>Dismiss front card</button>

<div style="position: relative; width: 256px; height: 256px;">
	<AnimatePresence initial={false} custom={exitDirection}>
		{#each cards as item (item.key)}
			<Card
				bind:index={
					() => item.key,
					(value) => {
						index = value;
					}
				}
				drag={item.isFront ? 'x' : false}
				frontCard={item.isFront}
				bind:exitX={exitDirection}
			/>
		{/each}
	</AnimatePresence>
</div>
