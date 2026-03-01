<script lang="ts">
	/**
	 * animate-style-autoplay test fixture - ported from framer-motion
	 * Tests that autoplay: false correctly pauses the animation on creation
	 * Expected: box width stays at 100px (animation doesn't start)
	 */
	import { animateMini } from '$lib/motion-start';
	import { onMount } from 'svelte';

	let boxRef: HTMLDivElement | undefined = $state();

	onMount(() => {
		if (!boxRef) return;

		// Animation should NOT start automatically due to autoplay: false
		animateMini(boxRef, { width: '200px' }, { duration: 0.1, autoplay: false });
	});
</script>

<div
	bind:this={boxRef}
	id="box"
	style="width: 100px; height: 100px; background: red;"
></div>
