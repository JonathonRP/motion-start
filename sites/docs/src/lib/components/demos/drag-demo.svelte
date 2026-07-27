<script lang="ts">
	import { motion } from "motion-start";
</script>

<div
	class="relative h-44 w-full overflow-hidden rounded-xl border border-border bg-background-alt"
>
	<motion.div
		class="absolute top-4 left-4 grid size-20 cursor-grab place-items-center rounded-2xl bg-linear-to-br from-brand to-brand/40 text-xs font-medium text-white select-none"
		drag
		dragConstraints={{ top: 0, left: 0, right: 240, bottom: 60 }}
		dragElastic={0.2}
		whileDrag={{ scale: 1.1, cursor: "grabbing" }}
		transition={{ type: "spring", stiffness: 300, damping: 25 }}
	>
		drag me
	</motion.div>
</div>
