<script lang="ts">
/**
 * Layout shared crossfade test: a -> b with transform template change
 * Tests crossfade transition where the transformTemplate prop changes
 * between elements during the crossfade
 * Ported from motiondivision/motion v11.11.11
 */
import { page } from '$app/state';
import { AnimatePresence, motion, type LayoutProps, type MotionStyle } from 'motion-start';

const type = $derived.by<LayoutProps['layout']>(() => {
	const value = page.url.searchParams.get('type');
	return value === 'position' || value === 'size' || value === 'preserve-aspect' ? value : true;
});
let state = $state(true);

const box = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	background: 'red',
} satisfies MotionStyle;

const a = {
	...box,
	width: '100px',
	height: '200px',
} satisfies MotionStyle;

const b = {
	...box,
	top: '50%',
	left: '50%',
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
		// Transform template changes between states
		useTransformTemplate: state,
	},
]);
</script>

<motion.div
	style={{
		position: 'relative',
		width: '500px',
		height: '500px',
		backgroundColor: 'blue',
	}}
>
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
				transition={{ duration: 1, ease: () => 0.5 }}
				onclick={() => state = !state}
				transformTemplate={item.useTransformTemplate
					? (_, generated) => 'translate(-50%, -50%) ' + generated
					: (_, generated) => 'rotate(45deg) translate(-50%, -50%) ' + generated}
			/>
		{/each}
	</AnimatePresence>
</motion.div>
