<script lang="ts">
	/**
	 * animate-reverse test fixture - ported from framer-motion
	 * Tests that animate() plays in reverse with negative speed when layout prop is present
	 * Expected: clicking #action button results in #result value = "Success"
	 */
	import { motion, animate } from '$lib/motion-start';
	import { onMount } from 'svelte';

	let boxRef: HTMLDivElement | undefined = $state();
	let result = $state('');

	function handleClick() {
		if (!boxRef) return;

		const controls = animate(
			boxRef,
			{ x: [100, 0] },
			{
				duration: 0.5,
				onComplete: () => {
					result = 'Success';
				},
			}
		);

		// Set reverse playback speed
		controls.speed = -1;
	}

	onMount(() => {
		(window as any).__testReady = true;
	});
</script>

<button id="action" onclick={handleClick}>Animate Reverse</button>
<input id="result" type="text" readonly value={result} />

<motion.div
	bind:this={boxRef}
	id="box"
	layout
	style={{ width: '100px', height: '100px', background: 'red' }}
></motion.div>
