<script lang="ts">
	import { Motion as motion, useMotionValue } from '$lib/motion-start';

	const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
	const type = params.get('type') || true;

	let state = $state(true);
	const backgroundColor = useMotionValue('red');

	const box = {
		position: 'absolute',
		top: '0',
		left: '0',
		background: 'red',
		display: 'flex',
		justifyContent: 'stretch',
		alignItems: 'stretch',
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
</script>

<motion.div
	style={{ ...(state ? a : b), backgroundColor }}
	onclick={() => state = !state}
	transition={{ duration: 0.15, ease: () => 0.5 }}
>
	<motion.svg
		id="box"
		data-testid="box"
		layout={type}
		viewBox="0 0 100 100"
		transition={{ duration: 0.15, ease: () => 0.5 }}
		style={{ flex: 1 }}
	/>
</motion.div>
