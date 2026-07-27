<script lang="ts">
import { motion } from 'motion-start';

let count = $state(0);

// Svelte doesn't have React Suspense. This fixture verifies that keyed
// remounts replay initial and animate states without testing suspension.
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
				Keyed remount animation
			</motion.div>
		</div>
	{/key}
</div>
<p>Click "Re-mount components" to replay the initial-to-animate transition.</p>
