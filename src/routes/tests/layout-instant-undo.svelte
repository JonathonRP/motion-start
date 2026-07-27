<script lang="ts">
import { motion } from '$lib/motion-start';
import type { MotionStyle } from '$lib/motion-start';

let state = $state(true);

const box: MotionStyle = {
	position: 'absolute',
	top: '0px',
	left: '200px',
	width: '100px',
	height: '100px',
	background: 'red',
};

const a = box;
const b: MotionStyle = { ...box, left: '500px' };

// Using $effect to simulate useLayoutEffect behavior
// Mirrors upstream useLayoutEffect: immediately undo the intermediate layout state.
$effect.pre(() => {
	if (state === false) {
		state = true;
	}
});
</script>


<motion.div
    id="box"
    data-testid="box"
    layout
    style={state ? a : b}
    onclick={() => state = !state}
    transition={{ duration: 10 }}
/>
