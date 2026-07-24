<script lang="ts">
	import { animate } from '$lib/motion-start';
	import { onMount } from 'svelte';

	onMount(() => {
		const controls = animate(
			'#box',
			{ x: [0, 100], opacity: [0, 1] },
			{ duration: 1 }
		);

		controls.cancel();
		controls.complete();
	});
</script>

<style>
	section {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: 100px;
	}

	#box {
		width: 100px;
		height: 100px;
		background-color: red;
		opacity: 0;
	}
</style>

<section>
	<div id="box"></div>
</section>
