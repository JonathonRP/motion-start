<script lang="ts">
import { AcceleratedAnimation, motionValue } from '$lib/motion-start';
import { onMount } from 'svelte';

let ref: HTMLDivElement | null = $state(null);
let text = $state('Content');

onMount(() => {
	if (!ref) return;

	const opacity = motionValue(0);
	const owner = { current: ref as HTMLDivElement | undefined, getProps: () => ({}) };
	(opacity as unknown as { owner: typeof owner }).owner = owner;

	const animation = new AcceleratedAnimation<number>({
		keyframes: [null as unknown as number, 1],
		motionValue: opacity,
		name: 'opacity',
	});

	animation.stop();

	if ((animation as unknown as { _resolved?: unknown })._resolved) {
		text = 'Error';
	}

	new AcceleratedAnimation({
		keyframes: [0.4, 0.5],
		motionValue: opacity,
		name: 'opacity',
	});

	owner.current = undefined;
});
</script>

<style>
	section {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: 100px;
	}

	#box {
		width: 100px;
		height: 100px;
		position: relative;
		top: 100px;
		left: 100px;
		background-color: red;
		opacity: 1;
	}
</style>

<section>
	<div bind:this={ref} id="box">{text}</div>
</section>
