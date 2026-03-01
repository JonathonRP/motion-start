<script lang="ts">
	/**
	 * animate-style test fixture - ported from framer-motion
	 * Tests that animateMini correctly runs an animation
	 * Expected: box width animates from 100px to 200px
	 */
	import { animateMini } from '$lib/motion-start';
	import { onMount } from 'svelte';

	let boxRef: HTMLDivElement | undefined = $state();

	onMount(() => {
		if (!boxRef) return;

		animateMini(boxRef, { width: '200px' }, { duration: 0.1 });
	});
</script>

<div
	bind:this={boxRef}
	id="box"
	style="width: 100px; height: 100px; background: red;"
></div>
