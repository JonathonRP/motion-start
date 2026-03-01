<script lang="ts">
	import { Motion as motion, useDragControls } from '$lib/motion-start';

	const container = {
		width: '200px',
		height: '200px',
		background: 'rgba(255,255,255,0.5)',
		borderRadius: '20px',
		margin: '20px',
	};

	const child = {
		width: '50vw',
		height: '300px',
		background: 'white',
		borderRadius: '20px',
	};

	const page = {
		position: 'absolute',
		top: '0',
		bottom: '0',
		left: '0',
		right: '0',
		background: 'black',
		paddingTop: '1000px',
		height: '100vh',
		display: 'flex',
	};

	const dragControls = useDragControls();

	function styleToString(obj: Record<string, string>) {
		return Object.entries(obj).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`).join(';');
	}
</script>

<div style={styleToString(page)}>
	<div
		style={styleToString(container)}
		onpointerdown={(e) => dragControls.start(e, { snapToCursor: true })}
		id="scroll-trigger"
	></div>
	<motion.div
		drag
		dragControls={dragControls}
		whileTap={{ scale: 0.95 }}
		style={child}
		id="scrollable"
	/>
</div>
