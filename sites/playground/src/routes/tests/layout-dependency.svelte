<script lang="ts">
import { page } from '$app/state';
import { motion, useMotionValue, type LayoutProps, type MotionStyle } from 'motion-start';

const toLayoutType = (value: string | null): LayoutProps['layout'] => {
	if (value === 'position' || value === 'size' || value === 'preserve-aspect') return value;
	if (value === 'false') return false;
	return true;
};

const type = $derived(toLayoutType(page.url.searchParams.get('type')));

let state = $state(true);
const backgroundColor = useMotionValue('red');

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
    layout={type}
    layoutDependency={0}
    style={{ ...(state ? a : b), backgroundColor }}
    onclick={() => (state = !state)}
    transition={{ duration: 0.15, ease: () => 0.5 }}
    onLayoutAnimationComplete={() => backgroundColor.set('blue')}
/>
