<script lang="ts">
import { motion } from '$lib/motion-start';
import type { LayoutProps, MotionStyle } from '$lib/motion-start';
import { page } from '$app/state';

function parseLayoutProp(value: string | null): LayoutProps['layout'] {
	if (!value || value === 'true') return true;
	if (value === 'false') return false;
	if (value === 'position' || value === 'size' || value === 'preserve-aspect') return value;
	return true;
}

const layoutProp = $derived(parseLayoutProp(page.url.searchParams.get('type')));

let state = $state(true);

const box: MotionStyle = {
	position: 'absolute',
	top: '0px',
	left: '0px',
	background: 'red',
};

const a: MotionStyle = {
	...box,
	width: '100px',
	height: '100px',
};

const b: MotionStyle = {
	...box,
	width: '400px',
	height: '200px',
	top: '100px',
	left: '100px',
};
</script>

<motion.div
    id="box"
    data-testid="box"
    layout={layoutProp}
    style={state ? a : b}
    onclick={() => state = !state}
    transition={{ duration: 3 }}
>
    <motion.div
        layout
        id="child"
        style={{ width: '100px', height: '100px', background: 'blue' }}
        transition={{ duration: 3 }}
    />
</motion.div>
