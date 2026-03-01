<script lang="ts">
	import { Motion as motion } from '$lib/motion-start';

	function range(num: number) {
		return Array.from(Array(num).keys());
	}

	const sharedMotionProps = {
		layout: true,
		style: { background: 'red', width: '100%', height: '100px' },
		transition: {
			duration: 0.25,
			delay: 0.3,
			ease: [0.2, 0.0, 0.83, 0.83],
			layout: { duration: 0.3, ease: [0.2, 0.0, 0.83, 0.83] },
		},
	};

	let count = $state(0);
</script>

<div style="height: 50px;">
	<button id="add" onclick={() => count++}>Add item</button>
	<button id="reset" onclick={() => count = 0}>Reset</button>
</div>
<div
	style="display: grid; grid-template-columns: repeat(auto-fill, minmax(127px, 1fr)); grid-gap: 10px; min-height: 100px; width: 500px;"
>
	{#each range(count).reverse() as i (i)}
		<motion.div id={`box-${i}`} {...sharedMotionProps}>
			{i}
		</motion.div>
	{/each}
</div>
