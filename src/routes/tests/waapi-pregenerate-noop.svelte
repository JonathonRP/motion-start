<script lang="ts">
import { motion } from '$lib/motion-start';
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
		transition={{
			duration: 0.5,
			delay: 2,
			ease: (x: number) => x,
		}}
		initial={{ transform: 'scale(1)' }}
		animate={{ transform: 'scale(1)' }}
	>
		Content
	</motion.div>
</section>
