<script lang="ts">
	/**
	 * animate-style-complete test fixture - ported from framer-motion
	 * Tests that complete() correctly finishes the animation immediately
	 * Expected: box width jumps to 200px immediately
	 */
	import { animateMini } from '$lib/motion-start';
	import { onMount } from 'svelte';

	let boxRef: HTMLDivElement | undefined = $state();

	onMount(() => {
		if (!boxRef) return;

		const controls = animateMini(boxRef, { width: '200px' }, { duration: 10 });

		// Call complete() immediately to finish the animation
		controls.complete();
	});
</script>

<div
	bind:this={boxRef}
	id="box"
	style="width: 100px; height: 100px; background: red;"
></div>
