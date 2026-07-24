<script lang="ts">
/**
 * Layout shared crossfade test: a -> b
 * Tests simple crossfade transition from element "a" to element "b"
 * Uses AnimatePresence with values array pattern for crossfade
 * Ported from motiondivision/motion v11.11.11
 */
import { page } from '$app/state';
import { AnimatePresence, motion, type LayoutProps, type MotionStyle } from '$lib/motion-start';

const type = $derived.by<LayoutProps['layout']>(() => {
	const value = page.url.searchParams.get('type');
	return value === 'position' || value === 'size' || value === 'preserve-aspect' ? value : true;
});
let state = $state(true);

const transition = {
	default: { duration: 1, ease: () => 0.5 },
	opacity: { duration: 1, ease: () => 0.1 },
};

const box = {
	position: 'absolute',
	top: '0px',
	left: '0px',
	background: 'red',
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

const items = $derived([
	{
		key: state ? 'a' : 'b',
		id: state ? 'a' : 'b',
		style: state ? a : b,
		backgroundColor: state ? '#f00' : '#0f0',
		borderRadius: state ? '0px' : '20px',
	},
]);
</script>

<AnimatePresence>
	{#each items as item (item.key)}
		<motion.div
			id={item.id}
			data-testid="box"
			layoutId="box"
			layout={type}
			style={{
				...item.style,
				backgroundColor: item.backgroundColor,
				borderRadius: item.borderRadius,
			}}
			transition={transition}
			onclick={() => state = !state}
		/>
	{/each}
</AnimatePresence>
