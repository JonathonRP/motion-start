<script lang="ts">
	/**
	 * animate-style-wildcard test fixture - ported from framer-motion
	 * Tests that wildcard keyframes (null initial value) work correctly
	 * Expected: box width animates from current value (100px) to 200px
	 */
	import { animateMini } from '$lib/motion-start';
	import { onMount } from 'svelte';

	let boxRef: HTMLDivElement | undefined = $state();

	onMount(() => {
		if (!boxRef) return;

		// Using null as initial value (wildcard) - reads from element's current style
		animateMini(boxRef, { width: [null, '200px'] }, { duration: 0.1 });
	});
</script>

<div
	bind:this={boxRef}
	id="box"
	style="width: 100px; height: 100px; background: red;"
></div>
