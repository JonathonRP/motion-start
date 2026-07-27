<script lang="ts">
	import { motion, useMotionValue, useTransform } from "motion-start";

	const x = useMotionValue(0);
	const rotate = useTransform(x, [-140, 140], [-24, 24]);
	const background = useTransform(
		x,
		[-140, 0, 140],
		["oklch(62% 0.2 20)", "var(--theme-color-brand, #a855f7)", "oklch(70% 0.18 155)"]
	);
</script>

<div
	class="relative grid h-40 w-full place-items-center overflow-hidden rounded-xl border border-border bg-background-alt"
>
	<motion.div
		class="grid size-24 cursor-grab place-items-center rounded-3xl text-xs font-medium text-white select-none active:cursor-grabbing"
		drag="x"
		dragConstraints={{ left: -140, right: 140 }}
		dragElastic={0.15}
		style={{ x, rotate, background }}
		whileTap={{ scale: 1.08 }}
	>
		drag x
	</motion.div>
</div>
