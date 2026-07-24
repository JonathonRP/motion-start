<script lang="ts">
import { animate, motion } from '$lib/motion-start';
import { tick } from 'svelte';

let count = $state(0);
let result = $state('');

$effect(() => {
	if (count % 2 === 0) return;

	let stop: VoidFunction | undefined;
	let cancelled = false;

	tick().then(() => {
		if (cancelled) return;

		const output: number[] = [];
		const controls = animate(0, 100, {
			duration: 0.5,
			ease: 'linear',
			onUpdate: (value: number) => output.push(value),
			onComplete: () => {
				const last = output[output.length - 1];
				result = output[0] >= 90 && last === 0 && output.length !== 2 ? 'Success' : 'Fail';
			},
		});

		controls.time = controls.duration;
		controls.speed = -1;
		stop = controls.stop;
	});

	return () => {
		cancelled = true;
		stop?.();
	};
});
</script>

<section
    style="position: relative; display: flex; flex-direction: column; padding: 100px;"
>
    <button id="action" onclick={() => (count += 1)}>Animate</button>
    <input id="result" type="text" readonly value={result} />
    <motion.div
        class="box"
        layout
        style={{ width: '100px', height: '100px', backgroundColor: 'red' }}
    />
</section>
