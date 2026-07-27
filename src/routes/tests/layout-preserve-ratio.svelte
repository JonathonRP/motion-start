<script lang="ts">
import { mix, motion, useAnimationFrame, useMotionValue, type MotionStyle } from '$lib/motion-start';

let state = $state(false);

const transition = {
	default: { duration: 5 },
};

const opacity = useMotionValue(0);
useAnimationFrame(() => opacity.set(mix(0.99, 1, Math.random())));

const parentStyle = $derived<MotionStyle>(
	state
		? { width: '100px', height: '200px', background: 'black' }
		: { width: '200px', height: '200px', background: 'black' }
);

const childStyle = $derived<MotionStyle>({
	position: 'absolute',
	top: '100px',
	left: '100px',
	background: 'red',
	width: state ? '100px' : '200px',
	height: '200px',
	opacity,
});
</script>

<motion.div layout style={parentStyle}>
    <motion.div
        id="a"
        layout="preserve-aspect"
        style={childStyle}
        onclick={() => (state = !state)}
        transition={transition}
    />
</motion.div>
