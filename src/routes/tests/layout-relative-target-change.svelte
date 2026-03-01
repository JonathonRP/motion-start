<script lang="ts">
	import { Motion as motion } from '$lib/motion-start';

	const box = {
		position: 'absolute',
		backgroundColor: 'red',
		inset: '0',
	};

	const a = { ...box };

	const b = {
		...box,
		inset: '-20px',
	};

	function styleToString(obj: Record<string, string>) {
		return Object.entries(obj).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`).join(';');
	}
</script>

<script lang="ts" module>
	import type { Snippet } from 'svelte';
</script>

{#snippet Box()}
	{@const boxHover = $state({ value: false })}
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
			style={boxHover.value ? b : a}
			onclick={(e: MouseEvent) => {
				e.stopPropagation();
				boxHover.value = !boxHover.value;
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

<script lang="ts">
	let hover = $state(false);
</script>

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
		transformTemplate={(_, generated) => `translateY(-50%) ${generated}`}
	>
		{@render Box()}
	</motion.div>
</motion.div>
