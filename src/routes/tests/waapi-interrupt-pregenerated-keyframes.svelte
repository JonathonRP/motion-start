<script lang="ts">
import { motion } from '$lib/motion-start';
import { onMount } from 'svelte';

let state = $state(false);

onMount(() => {
	const timer = setTimeout(() => {
		state = !state;
	}, 50);

	return () => clearTimeout(timer);
});
</script>

<style>
	section {
		position: relative;
		display: flex;
		flex-direction: column;
	}

	:global(#box) {
		width: 100px;
		height: 100px;
		position: relative;
		background-color: red;
		opacity: 1;
	}
</style>

<section>
	<motion.div
		id="box"
		transition={{ type: 'spring' }}
		initial={{ clipPath: 'inset(0px)' }}
		animate={{ clipPath: state ? 'inset(0px)' : 'inset(20px)' }}
	>
		Content
	</motion.div>
</section>
