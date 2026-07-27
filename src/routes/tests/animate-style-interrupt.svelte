<script lang="ts">
	/**
	 * animate-style-interrupt test fixture - ported from framer-motion
	 * Tests that an animation can be interrupted by starting a new animation
	 * Expected: when a new animation starts, the previous one is interrupted
	 */
	import { animateMini } from '$lib/motion-start';
	import { onMount } from 'svelte';

	let boxRef: HTMLDivElement | undefined = $state();

	onMount(() => {
		if (!boxRef) return;

		// Start first animation (long duration)
		animateMini(boxRef, { opacity: 0 }, { duration: 10 });

		// Interrupt with second animation after a short delay
		setTimeout(() => {
			if (!boxRef) return;
			// Second animation should interrupt the first
			animateMini(boxRef, { opacity: 0.5 }, { duration: 0.1 });
		}, 50);
	});
</script>

<div
	bind:this={boxRef}
	id="box"
	style="width: 100px; height: 100px; background: red; opacity: 1;"
></div>
