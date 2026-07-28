<script lang="ts">
	import { motion } from "motion-start";

	const container = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.08, delayChildren: 0.1 },
		},
	};

	const item = {
		hidden: { opacity: 0, y: 16 },
		visible: { opacity: 1, y: 0 },
	};
</script>

<motion.ul
	class="flex list-none gap-3 p-0"
	variants={container}
	initial="hidden"
	whileInView="visible"
	viewport={{ once: false, amount: 0.6 }}
>
	{#each [1, 2, 3, 4, 5] as n (n)}
		<motion.li
			variants={item}
			class="grid size-14 place-items-center rounded-xl bg-linear-to-br from-brand to-brand/40 font-mono text-sm text-white"
		>
			{n}
		</motion.li>
	{/each}
</motion.ul>
