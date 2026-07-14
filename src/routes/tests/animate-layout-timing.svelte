<script lang="ts">
import { animate, motion } from '$lib/motion-start';

let result = $state('');

function handleClick() {
	const output: number[] = [];

	animate(0, 100, {
		duration: 0.5,
		ease: 'linear',
		onUpdate: (value: number) => output.push(value),
		onComplete: () => {
			result = output[1] !== 100 && output.length !== 2 ? 'Success' : 'Fail';
		},
	});
}
</script>

<section
    style="position: relative; display: flex; flex-direction: column; padding: 100px;"
>
    <button id="action" onclick={handleClick}>Animate</button>
    <input id="result" type="text" readonly value={result} />
    <motion.div
        class="box"
        layout
        style={{ width: '100px', height: '100px', backgroundColor: 'red' }}
    />
</section>
