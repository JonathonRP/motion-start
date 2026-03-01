<script lang="ts">
	import { Motion as motion } from '$lib/motion-start';

	const container = {
		width: '50%',
		height: '300px',
		background: 'blue',
		borderRadius: '20px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		margin: '0 auto',
	};

	const child = {
		width: '200px',
		height: '200px',
		background: 'red',
		borderRadius: '20px',
	};

	let constraintsRef: HTMLDivElement | undefined = $state();
	let count = $state(0);
</script>

<div bind:this={constraintsRef} style={Object.entries(container).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`).join(';')} id="constraints">
	<motion.div
		drag
		dragConstraints={constraintsRef}
		whileTap={{ scale: 0.95 }}
		whileHover={{ scale: 1.1 }}
		style={child}
		onclick={() => count++}
		id="box"
	/>
</div>
