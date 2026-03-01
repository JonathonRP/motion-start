<script lang="ts">
	/**
	 * animate-style-pause test fixture - ported from framer-motion
	 * Tests that pause() correctly pauses the animation
	 * Expected: box width is between 100px and 200px (not at either end)
	 */
	import { animateMini } from '$lib/motion-start';
	import { onMount } from 'svelte';

	let boxRef: HTMLDivElement | undefined = $state();

	onMount(() => {
		if (!boxRef) return;

		const controls = animateMini(boxRef, { width: '200px' }, { duration: 1 });

		// Pause the animation midway
		setTimeout(() => {
			controls.pause();
		}, 100);
	});
</script>

<div
	bind:this={boxRef}
	id="box"
	style="width: 100px; height: 100px; background: red;"
></div>
