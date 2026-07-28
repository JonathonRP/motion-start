<script lang="ts">
import {
	AnimatePresence,
	motion,
	useInstantLayoutTransition,
	type LayoutProps,
	type MotionStyle,
} from 'motion-start';
import { page } from '$app/state';

function parseLayoutProp(value: string | null): LayoutProps['layout'] {
	if (!value || value === 'true') return true;
	if (value === 'false') return false;
	if (value === 'position' || value === 'size' || value === 'preserve-aspect') return value;
	return true;
}

const startTransition = useInstantLayoutTransition();
const type = $derived(parseLayoutProp(page.url.searchParams.get('type')));

let bgColor = $state('#f00');
let isExpanded = $state(false);

const transition = {
	default: { duration: 0.2, ease: () => 0.5 },
	opacity: { duration: 0.2, ease: () => 0.1 },
};

const box: MotionStyle = {
	position: 'absolute',
	top: '0px',
	left: '0px',
};

const a: MotionStyle = {
	...box,
	width: '100px',
	height: '200px',
	borderRadius: '0px',
};

const b: MotionStyle = {
	...box,
	top: '100px',
	left: '200px',
	width: '300px',
	height: '300px',
	borderRadius: '20px',
};

const items = $derived([{ key: 'a', id: 'a' }, ...(isExpanded ? [{ key: 'b', id: 'b' }] : [])]);

function instantTransit() {
	startTransition(() => {
		bgColor = '#00f';
	});
	isExpanded = !isExpanded;
}
</script>

<AnimatePresence>
    {#each items as item (item.key)}
        {#if item.id === 'a'}
            <motion.div
                id="a"
                data-testid="box"
                layoutId="box"
                layout={type}
                style={{ ...a, background: bgColor }}
                onclick={instantTransit}
                transition={transition}
            />
        {:else}
            <motion.div
                id="b"
                layoutId="box"
                style={{ ...b, background: bgColor }}
                onclick={() => (isExpanded = !isExpanded)}
            />
        {/if}
    {/each}
</AnimatePresence>
