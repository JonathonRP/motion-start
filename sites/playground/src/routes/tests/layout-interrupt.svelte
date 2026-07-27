<script lang="ts">
import { motion, type MotionStyle } from 'motion-start';

let count = $state(0);

const box: MotionStyle = {
	position: 'absolute',
	top: '0px',
	left: '0px',
	background: 'red',
};

const a: MotionStyle = {
	...box,
	width: '100px',
	height: '200px',
};

const b: MotionStyle = {
	...box,
	top: '100px',
	left: '200px',
	width: '300px',
	height: '300px',
};
</script>

<motion.div
    id="box"
    data-testid="box"
    layout
    style={count === 0 ? a : b}
    onclick={() => count++}
    transition={{ duration: 10, ease: () => 0.5 }}
/>
