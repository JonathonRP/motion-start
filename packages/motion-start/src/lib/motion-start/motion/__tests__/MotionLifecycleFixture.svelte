<script lang="ts">
import { motion } from '../../index.js';

interface Props {
	onExternalComplete?: () => void;
}

let { onExternalComplete }: Props = $props();
let x = $state(0);
let duration = $state(0.02);
let useSecondHandler = $state(false);
let firstStarts = $state(0);
let secondStarts = $state(0);
let completes = $state(0);
let updates = $state(0);

function handleComplete() {
	completes++;
	onExternalComplete?.();
}
</script>

<button id="animate-first" onclick={() => (x = 100)}>first</button>
<button id="replace-handler" onclick={() => (useSecondHandler = true)}>replace handler</button>
<button id="animate-second" onclick={() => (x = 200)}>second</button>
<button
	id="animate-long"
	onclick={() => {
		duration = 0.2;
		x = 300;
	}}>long</button
>

<output id="first-starts">{firstStarts}</output>
<output id="second-starts">{secondStarts}</output>
<output id="completes">{completes}</output>
<output id="updates">{updates}</output>

<motion.div
	id="motion-target"
	initial={false}
	animate={{ x }}
	transition={{ duration }}
	onAnimationStart={useSecondHandler ? () => secondStarts++ : () => firstStarts++}
	onAnimationComplete={handleComplete}
	onUpdate={() => updates++}
/>
