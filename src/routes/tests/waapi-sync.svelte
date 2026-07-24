<script lang="ts">
import { animate, motion, useMotionValue } from '$lib/motion-start';
import type { ValueAnimationTransition } from '$lib/motion-start';
import { onMount } from 'svelte';

const opacity = useMotionValue(0);

let waapiRef: HTMLDivElement | null = $state(null);
let syncRef: HTMLDivElement | null = $state(null);

const waapiStartTime = useMotionValue('--');
const syncStartTime = useMotionValue('--');
const waapiExplicitStartTime = useMotionValue('--');
const syncExplicitStartTime = useMotionValue('--');

onMount(() => {
	const settings: ValueAnimationTransition = {
		duration: 2,
		ease: 'linear',
	};

	if (!waapiRef || !syncRef) return;

	const waapiAnimation = animate(waapiRef, { opacity: [0, 1] }, settings);
	const syncAnimation = animate(syncRef, { opacity: [0, 1] }, settings);

	const startTime = Math.round(performance.now() - 101);

	const waapiExplicitAnimation = animate(waapiRef, { filter: ['blur(0px)', 'blur(1px)'] }, { ...settings, startTime });
	const syncExplicitAnimation = animate(
		syncRef,
		{ backgroundColor: ['rgb(255, 0, 0)', 'rgb(0, 0, 255)'] },
		{ ...settings, startTime }
	);

	const timeout = setTimeout(() => {
		waapiStartTime.set(waapiAnimation.startTime?.toString() || 'waapi start time not available');
		syncStartTime.set(syncAnimation.startTime?.toString() || 'sync start time not available');
		waapiExplicitStartTime.set(
			waapiExplicitAnimation.startTime?.toString() || 'waapi explicit start time not available'
		);
		syncExplicitStartTime.set(syncExplicitAnimation.startTime?.toString() || 'sync explicit start time not available');
	}, 500);

	return () => {
		waapiAnimation.stop();
		syncAnimation.stop();
		waapiExplicitAnimation.stop();
		syncExplicitAnimation.stop();
		clearTimeout(timeout);
	};
});
</script>

<style>
	section {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: 100px;
	}

	.box {
		width: 100px;
		height: 100px;
		background-color: red;
		opacity: 0;
	}
</style>

<section>
	<div bind:this={waapiRef} class="box"></div>
	<div bind:this={syncRef} class="box" style:opacity={opacity.get()}></div>
	<motion.pre id="waapi-start-time" class="auto-timer waapi-timer">
		{waapiStartTime.get()}
	</motion.pre>
	<motion.pre id="sync-start-time" class="auto-timer sync-timer">
		{syncStartTime.get()}
	</motion.pre>
	<motion.pre id="waapi-explicit-start-time" class="explicit-timer waapi-timer">
		{waapiExplicitStartTime.get()}
	</motion.pre>
	<motion.pre id="sync-explicit-start-time" class="explicit-timer sync-timer">
		{syncExplicitStartTime.get()}
	</motion.pre>
</section>
