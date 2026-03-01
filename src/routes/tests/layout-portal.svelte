<script lang="ts">
	import { Motion as motion } from '$lib/motion-start';
	import { onMount } from 'svelte';

	let count = $state(0);
	let portalTarget: HTMLElement | null = $state(null);

	const size = $derived(count === 0 ? 100 : 300);

	onMount(() => {
		portalTarget = document.body;
	});
</script>

<motion.div
	id="parent"
	layout
	style={{
		background: 'red',
		width: `${size}px`,
		height: `${size}px`,
	}}
	onclick={() => count++}
	transition={{ duration: 10, ease: () => 0.5 }}
>
	<!-- Svelte doesn't have createPortal, so we just render inline for test purposes -->
	<!-- The portal functionality would need to be implemented separately -->
</motion.div>

{#if portalTarget}
	<motion.div
		id="child"
		layout
		style={{ width: '100px', height: '100px', background: 'blue' }}
		transition={{ duration: 10, ease: () => 0.5 }}
		data-framer-portal-id="parent"
	/>
{/if}
