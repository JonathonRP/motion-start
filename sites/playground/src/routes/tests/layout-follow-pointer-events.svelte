<script lang="ts">
import { motion, MotionConfig, type MotionStyle } from 'motion-start';

let isOpen = $state(false);

const box: MotionStyle = {
	background: 'red',
};

const a: MotionStyle = {
	...box,
	width: '100px',
	height: '200px',
};

const b: MotionStyle = {
	...box,
	width: '300px',
	height: '300px',
	background: 'blue',
	borderRadius: '20px',
};
</script>

<MotionConfig transition={{ duration: 0.1 }}>
    <motion.div id="a" layoutId="box" style={a} onclick={() => (isOpen = true)} />
    {#if isOpen}
        <motion.div id="b" layoutId="box" style={b} onclick={() => (isOpen = false)} />
    {/if}
</MotionConfig>
