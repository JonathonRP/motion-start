<script lang="ts">
	/**
	 * animate-style-promise test fixture - ported from framer-motion
	 * Tests that the animation promise fires on end
	 * Expected: box background turns red when animation completes
	 */
	import { animateMini } from '$lib/motion-start';
	import { onMount } from 'svelte';

	let boxRef: HTMLDivElement | undefined = $state();

	onMount(() => {
		if (!boxRef) return;

		const controls = animateMini(boxRef, { width: '200px' }, { duration: 0.05 });

		// When the animation completes, change background to red
		controls.then(() => {
			if (boxRef) {
				boxRef.style.backgroundColor = 'red';
			}
		});
	});
</script>

<div
	bind:this={boxRef}
	id="box"
	style="width: 100px; height: 100px; background: blue;"
></div>
