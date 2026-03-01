<script lang="ts">
	import { Motion as motion } from '$lib/motion-start';

	let count = $state(0);

	// Note: Svelte doesn't have React Suspense. This is a simplified version
	// that demonstrates the animation behavior without actual suspension.
	// The test verifies animation initial/animate states work correctly.
</script>

<button onclick={() => count++}>Re-mount components</button>
<div style="width: 300px; margin: 100px auto;">
	{#key count}
		<div style="margin-bottom: 24px;">
			<motion.div
				style={{ fontWeight: 'bold', display: 'inline-block' }}
				initial={{ opacity: 0.2, scale: 1 }}
				animate={{ opacity: 1, scale: 2 }}
				transition={{ duration: 2 }}
			>
				With suspense
			</motion.div>
		</div>
	{/key}
</div>
<p>
	The above animation is the same for both components. One
	suspends halfway through and the other does not. Click "Re-mount
	components" to run the animations again. Notice how the scale
	animation is stuck half way and the opacity animation is reset
	in the suspended component.
</p>
