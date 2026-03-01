<script lang="ts">
	import { Motion as motion, useInstantLayoutTransition } from '$lib/motion-start';

	const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
	const type = params.get('type') || true;

	let bgColor = $state('#f00');
	let state = $state(true);

	const startTransition = useInstantLayoutTransition();

	const box = {
		position: 'absolute',
		top: '0',
		left: '0',
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

	function handleClick() {
		startTransition(() => {
			bgColor = '#00f';
		});
		state = !state;
	}
</script>

{#key state}
	<motion.div
		id={state ? 'a' : 'b'}
		data-testid="box"
		layoutId="box"
		layout={type}
		style={{
			...(state ? a : b),
			backgroundColor: bgColor,
			borderRadius: state ? '0' : '20px',
		}}
		onclick={handleClick}
	/>
{/key}
