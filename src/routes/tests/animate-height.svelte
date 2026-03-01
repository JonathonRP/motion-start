<script lang="ts">
	/**
	 * animate-height test fixture - ported from framer-motion
	 * Tests height animation
	 */
	import { motion } from '$lib/motion-start';
	import { onMount } from 'svelte';

	let show = $state(true);

	onMount(() => {
		(window as any).__testReady = true;
	});
</script>

<motion.div
	id="box"
	initial={{ height: 100 }}
	animate={{ height: 200 }}
	transition={{ duration: 0.1 }}
	style={{ width: '100px', background: 'red' }}
></motion.div>
