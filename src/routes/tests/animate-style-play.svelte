<script lang="ts">
	/**
	 * animate-style-play test fixture - ported from framer-motion
	 * Tests that play() correctly resumes a paused animation
	 * Expected: box width animates to 200px after play() is called
	 */
	import { animateMini } from '$lib/motion-start';
	import { onMount } from 'svelte';

	let boxRef: HTMLDivElement | undefined = $state();

	onMount(() => {
		if (!boxRef) return;

		// Start with autoplay: false (paused)
		const controls = animateMini(boxRef, { width: '200px' }, { duration: 0.1, autoplay: false });

		// Call play() after a short delay to resume
		setTimeout(() => {
			controls.play();
		}, 50);
	});
</script>

<div
	bind:this={boxRef}
	id="box"
	style="width: 100px; height: 100px; background: red;"
></div>
