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
	layout={type}
	layoutDependency={0}
	style={{ ...(state ? a : b), backgroundColor }}
	onclick={() => state = !state}
	transition={{ duration: 0.15, ease: () => 0.5 }}
	onLayoutAnimationComplete={() => backgroundColor.set('blue')}
/>
