<script lang="ts">
	import { Motion as motion } from '$lib/motion-start';

	const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
	const type = params.get('type') || true;

	let count = $state(0);

	const transition = {
		default: { duration: 0.2, ease: () => 0.5 },
	};

	const overlay = {
		position: 'fixed',
		inset: '0',
	};

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

<div id="trigger" style={styleToString(overlay)} onclick={() => count++}>
	{#if count === 1 || count === 3}
		<motion.div
			id="a"
			layoutId="box"
			layout={type}
			style={a}
			transition={transition}
		/>
	{/if}
	{#if count === 2}
		<motion.div
			id="b"
			layoutId="box"
			style={b}
			transition={transition}
		/>
	{/if}
</div>
