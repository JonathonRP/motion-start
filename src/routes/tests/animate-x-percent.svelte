<script lang="ts">
	/**
	 * animate-x-percent test fixture - ported from framer-motion
	 * Tests that percentage-based x animation works correctly
	 */
	import { motion } from '$lib/motion-start';
	import { onMount } from 'svelte';

	onMount(() => {
		(window as any).__testReady = true;
	});
</script>

<div style="width: 200px; height: 100px; position: relative; background: #eee;">
	<motion.div
		id="box"
		initial={{ x: '0%' }}
		animate={{ x: '100%' }}
		transition={{ duration: 0.2 }}
		style={{
			width: '50px',
			height: '50px',
			background: 'red',
			position: 'absolute',
		}}
	></motion.div>
</div>
