<script lang="ts">
import { motion, type LayoutProps, type MotionStyle } from 'motion-start';
import { page } from '$app/state';

function parseLayoutProp(value: string | null): LayoutProps['layout'] {
	if (!value || value === 'true') return true;
	if (value === 'false') return false;
	if (value === 'position' || value === 'size' || value === 'preserve-aspect') return value;
	return true;
}

const type = $derived(parseLayoutProp(page.url.searchParams.get('type')));
let count = $state(0);

function nextCount() {
	count = count + 1;
}

function handleKeydown(event: KeyboardEvent) {
	if (event.key === 'Enter' || event.key === ' ') nextCount();
}

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

<div
    id="trigger"
    style="position: absolute; top: 0; right: 0; bottom: 0; left: 0;"
    role="button"
    tabindex="0"
    onclick={nextCount}
    onkeydown={handleKeydown}
>
    {#if count >= 1 && count <= 3}
        <motion.div
            id="a"
            layoutId="box"
            layout={type}
            style={a}
        />
    {/if}
    {#if count === 2}
        <motion.div
            id="b"
            layoutId="box"
            style={b}
        />
    {/if}
</div>
