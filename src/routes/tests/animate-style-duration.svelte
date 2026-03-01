<script lang="ts">
	/**
	 * animate-style-duration test fixture - ported from framer-motion
	 * Tests that animateMini correctly respects the duration option
	 * Expected: animation completes in specified duration
	 */
	import { animateMini } from '$lib/motion-start';
	import { onMount } from 'svelte';

	let boxRef: HTMLDivElement | undefined = $state();

	onMount(() => {
		if (!boxRef) return;

		// Start time tracking
		const startTime = performance.now();

		animateMini(boxRef, { opacity: 0.5 }, { duration: 0.5 }).then(() => {
			const endTime = performance.now();
			const elapsed = endTime - startTime;
			// Store the elapsed time in a data attribute for testing
			if (boxRef) {
				boxRef.dataset.elapsed = String(Math.round(elapsed));
			}
		});
	});
</script>

<div
	bind:this={boxRef}
	id="box"
	style="width: 100px; height: 100px; background: red; opacity: 1;"
></div>
