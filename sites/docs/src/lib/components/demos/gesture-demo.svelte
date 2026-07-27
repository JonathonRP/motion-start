<script lang="ts">
	import { motion } from "motion-start";

	const box =
		"grid size-20 place-items-center rounded-2xl bg-linear-to-br from-brand to-brand/40 text-xs font-medium text-white select-none";
</script>

<div class="flex flex-wrap items-center gap-6">
	<motion.div
		class={box}
		whileHover={{ scale: 1.12 }}
		whileTap={{ scale: 0.92 }}
		transition={{ type: "spring", stiffness: 400, damping: 20 }}
	>
		hover me
	</motion.div>

	<motion.div
		class={box}
		whileHover={{ rotate: 12, borderRadius: "50%" }}
		transition={{ type: "spring", stiffness: 300, damping: 22 }}
	>
		rotate
	</motion.div>

	<motion.div
		class={box}
		whileTap={{ scale: 0.85, rotate: -8 }}
		transition={{ type: "spring", stiffness: 500, damping: 15 }}
	>
		tap me
	</motion.div>
</div>
