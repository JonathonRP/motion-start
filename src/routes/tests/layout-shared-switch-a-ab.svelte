<script lang="ts">
import { motion, type LayoutProps, type MotionStyle } from '$lib/motion-start';
import { page } from '$app/state';

function parseLayoutProp(value: string | null): LayoutProps['layout'] {
	if (!value || value === 'true') return true;
	if (value === 'false') return false;
	if (value === 'position' || value === 'size' || value === 'preserve-aspect') return value;
	return true;
}

const type = $derived(parseLayoutProp(page.url.searchParams.get('type')));
let state = $state(false);

const transition = {
	default: { duration: 0.2, ease: () => 0.1 },
};

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
    id="a"
    layoutId="box"
    layout={type}
    style={a}
    onclick={() => (state = !state)}
    transition={transition}
/>

{#if state}
    <motion.div
        id="b"
        layoutId="box"
        style={b}
        transition={transition}
        onclick={() => (state = !state)}
    />
{/if}
