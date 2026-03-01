<script lang="ts">
	/**
	 * animate-layout-timing test fixture - ported from framer-motion
	 * Tests that animate() plays as expected when layout prop is present
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
			{ x: 100 },
			{
				duration: 0.5,
				onComplete: () => {
					result = 'Success';
				},
			}
		);
	}

	onMount(() => {
		(window as any).__testReady = true;
	});
</script>

<button id="action" onclick={handleClick}>Animate</button>
<input id="result" type="text" readonly value={result} />

<motion.div
	bind:this={boxRef}
	id="box"
	layout
	style={{ width: '100px', height: '100px', background: 'red' }}
></motion.div>
