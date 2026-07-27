<script lang="ts">
import { motion } from '$lib/motion-start';

let state = $state(false);
</script>

<style>
	section {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: 100px;
	}

	:global(#box) {
		width: 100px;
		height: 100px;
		position: relative;
		top: 100px;
		left: 100px;
		background-color: red;
		opacity: 1;
	}
</style>

<section>
	<motion.div
		id="box"
		transition={{ duration: 1 }}
		initial={{ transform: 'scale(1)', opacity: 1 }}
		animate={{
			transform: `scale(${state ? 1 : 2})`,
			opacity: state ? 1 : 0,
		}}
		onclick={() => (state = !state)}
	>
		Content
	</motion.div>
</section>
