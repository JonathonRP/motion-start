<script lang="ts">
/**
 * Layout shared crossfade test: nested drag
 * Tests crossfade transition with nested draggable elements
 * Verifies that drag interactions work correctly during layout animations
 * Ported from motiondivision/motion v11.11.11
 */
import { page } from '$app/state';
import { AnimatePresence, motion, type LayoutProps, type MotionStyle } from 'motion-start';

const type = $derived.by<LayoutProps['layout']>(() => {
	const value = page.url.searchParams.get('type');
	return value === 'position' || value === 'size' || value === 'preserve-aspect' ? value : true;
});
let state = $state(true);

const transition = { duration: 1, ease: () => 0.5 };

const container = 'position: relative; width: 500px; height: 500px;';

const box = {
	position: 'absolute',
	top: '0px',
	left: '0px',
	background: 'red',
} satisfies MotionStyle;

const a = {
	...box,
	width: '200px',
	height: '200px',
	top: '50px',
	left: '50px',
} satisfies MotionStyle;

const b = {
	...box,
	top: '200px',
	left: '200px',
	width: '250px',
	height: '250px',
} satisfies MotionStyle;

const child = {
	width: '80px',
	height: '80px',
	background: 'blue',
	borderRadius: '10px',
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

<div style={container}>
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
			>
				<motion.div
					id="drag-child"
					drag
					dragMomentum={false}
					dragElastic={0}
					style={child}
					transition={transition}
				/>
			</motion.div>
		{/each}
	</AnimatePresence>
</div>
