<script lang="ts">
	/**
	 * This example checks that the targetBox is correctly adjusted for changes in scroll.
	 *
	 * Click the blue button to force a re-render.
	 *
	 * Drag the red box (position static) and the green box (position fixed).
	 * Scroll. Click the blue button. Both boxes should stay in the correct place.
	 *
	 * TODO: automate this test
	 */
	import { Motion as motion } from '$lib/motion-start';

	let count = $state(0);

	function forceRender() {
		count++;
	}
</script>

<div
	style="height: 2000vh; background: linear-gradient(#fff, #000);"
>
	<motion.div
		drag
		style={{ width: '100px', height: '100px', background: 'red' }}
	/>
	<motion.div
		layout
		style={{
			width: '100px',
			height: '100px',
			position: 'relative',
			left: `${count * 10}px`,
			background: 'purple',
		}}
	/>
	<motion.div
		drag
		style={{
			width: '100px',
			height: '100px',
			background: 'green',
			position: 'fixed',
		}}
	/>
	<div
		style="position: fixed; bottom: 10px; left: 10px; width: 50px; height: 50px; border-radius: 25px; background: blue;"
		onclick={forceRender}
	></div>
</div>
