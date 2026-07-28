<script lang="ts">
/**
 * animate-style-pause test fixture - ported from framer-motion
 * Tests that pause() correctly pauses the animation
 * Expected: box width is between 100px and 200px (not at either end)
 */
import { animateMini } from 'motion-start';
import { onMount } from 'svelte';

let boxRef: HTMLDivElement | undefined = $state();
// biome-ignore lint/correctness/noUnusedVariables: Used by the {@attach} directive.
const attachBox = (node: HTMLDivElement) => {
	boxRef = node;
	return () => {
		if (boxRef === node) boxRef = undefined;
	};
};

onMount(() => {
	if (!boxRef) return;

	const controls = animateMini(boxRef, { width: 200 }, { duration: 0.2 });

	// Pause the animation midway
	const pauseTimer = setTimeout(() => {
		controls.pause();
	}, 100);

	return () => {
		clearTimeout(pauseTimer);
		controls.cancel();
	};
});
</script>

<div {@attach attachBox} id="box" style="width: 100px; height: 100px; background: red;"></div>
