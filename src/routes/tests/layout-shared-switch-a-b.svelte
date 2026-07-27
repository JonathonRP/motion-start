<script lang="ts">
import { motion, useMotionValue } from '$lib/motion-start';
import type { LayoutProps, MotionStyle } from '$lib/motion-start';
import { page } from '$app/state';

function parseLayoutProp(value: string | null): LayoutProps['layout'] {
	if (!value || value === 'true') return true;
	if (value === 'false') return false;
	if (value === 'position' || value === 'size' || value === 'preserve-aspect') return value;
	return true;
}

const type = $derived(parseLayoutProp(page.url.searchParams.get('type')));
let state = $state(true);

const backgroundColor = useMotionValue('#f00');

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

{#key state ? 'a' : 'b'}
    <motion.div
        id={state ? 'a' : 'b'}
        data-testid="box"
        layoutId="box"
        layout={type}
        style={{
            ...(state ? a : b),
            backgroundColor,
            borderRadius: state ? '0px' : '20px',
            opacity: state ? 0.4 : 1,
        }}
        onclick={() => state = !state}
        transition={{ duration: 0.3, ease: () => 0.5 }}
        onLayoutAnimationStart={() => backgroundColor.set('#0f0')}
        onLayoutAnimationComplete={() => backgroundColor.set('#00f')}
    />
{/key}
