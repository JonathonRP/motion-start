<script lang="ts">
import { page } from '$app/state';
import { motion, useMotionValue, type LayoutProps, type MotionStyle } from '$lib/motion-start';

const toLayoutType = (value: string | null): LayoutProps['layout'] => {
	if (value === 'position' || value === 'size' || value === 'preserve-aspect') return value;
	if (value === 'false') return false;
	return true;
};

const layoutProp = $derived(toLayoutType(page.url.searchParams.get('type')));

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

function handleClick() {
	state = !state;
}
</script>

<motion.div
    id="box"
    data-testid="box"
    layout={layoutProp}
    style={{ ...(state ? a : b), backgroundColor }}
    onclick={handleClick}
    transition={{ duration: 0.2, ease: () => 0.5 }}
    onLayoutAnimationStart={() => backgroundColor.set('green')}
    onLayoutAnimationComplete={() => backgroundColor.set('blue')}
/>
