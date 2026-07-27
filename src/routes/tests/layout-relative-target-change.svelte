<script lang="ts">
import { motion, type MotionStyle } from '$lib/motion-start';

const box = {
	position: 'absolute',
	backgroundColor: 'red',
	inset: '0',
} satisfies MotionStyle;

const a = { ...box } satisfies MotionStyle;

const b = {
	...box,
	inset: '-20px',
} satisfies MotionStyle;

let hover = $state(false);
let boxHover = $state(false);
</script>

{#snippet Box()}
	<motion.div
		id="container"
		layout
		style={{
			width: '80px',
			height: '80px',
			position: 'relative',
		}}
		transition={{ duration: 1 }}
	>
		<motion.div
			id="box"
			data-testid="box"
			layout
			style={boxHover ? b : a}
			onclick={(e: MouseEvent) => {
				e.stopPropagation();
				boxHover = !boxHover;
			}}
			transition={{ duration: 1 }}
		>
			<motion.div
				id="inner-box"
				layout
				style={{
					position: 'absolute',
					width: '40px',
					height: '40px',
					left: 'calc(50% - 20px)',
					top: 'calc(50% - 20px)',
					backgroundColor: 'blue',
				}}
				transition={{ duration: 1 }}
			/>
		</motion.div>
	</motion.div>
{/snippet}

<motion.div style={{ width: '400px', height: '400px', position: 'relative' }}>
	<motion.div
		id="parent"
		layout
		style={{
			position: 'absolute',
			width: '200px',
			height: '200px',
			left: hover ? '100%' : '0',
			top: '50%',
			backgroundColor: 'green',
		}}
		onclick={() => hover = !hover}
		transition={{ duration: 5, ease: () => 0.5 }}
		transformTemplate={(_, generated) => 'translateY(-50%) ' + generated}
	>
		{@render Box()}
	</motion.div>
</motion.div>
