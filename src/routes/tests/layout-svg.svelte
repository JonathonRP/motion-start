<script lang="ts">
import { motion, type LayoutProps, type MotionStyle, useMotionValue } from '$lib/motion-start';

const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
const paramType = params.get('type');
const type: LayoutProps['layout'] =
	paramType === 'position' || paramType === 'size' || paramType === 'preserve-aspect' ? paramType : true;

let state = $state(true);
const backgroundColor = useMotionValue('red');

const box = {
	position: 'absolute',
	top: '0',
	left: '0',
	background: 'red',
	display: 'flex',
	justifyContent: 'stretch',
	alignItems: 'stretch',
} satisfies MotionStyle;

const a = {
	...box,
	width: '100px',
	height: '200px',
} satisfies MotionStyle;

const b = {
	...box,
	top: '100px',
	left: '200px',
	width: '300px',
	height: '300px',
} satisfies MotionStyle;
</script>

<motion.div
	style={{ ...(state ? a : b), backgroundColor }}
	onclick={() => state = !state}
	transition={{ duration: 0.15, ease: () => 0.5 }}
>
	<motion.svg
		id="box"
		data-testid="box"
		layout={type}
		viewBox="0 0 100 100"
		transition={{ duration: 0.15, ease: () => 0.5 }}
		style={{ flex: '1' }}
	/>
</motion.div>
