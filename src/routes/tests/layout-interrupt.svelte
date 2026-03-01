<script lang="ts">
	import { Motion as motion } from '$lib/motion-start';

	let count = $state(0);

	const box = {
		position: 'absolute',
		top: '0',
		left: '0',
		background: 'red',
	};

	const a = {
		...box,
		width: '100px',
		height: '200px',
	};

	const b = {
		...box,
		top: '100px',
		left: '200px',
		width: '300px',
		height: '300px',
	};

	function styleToString(obj: Record<string, string>) {
		return Object.entries(obj).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`).join(';');
	}
</script>

<motion.div
	id="box"
	data-testid="box"
	layout
	style={count === 0 ? a : b}
	onclick={() => count++}
	transition={{ duration: 10, ease: () => 0.5 }}
/>
