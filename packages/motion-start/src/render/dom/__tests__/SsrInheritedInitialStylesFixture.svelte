<svelte:options runes />

<script lang="ts">
import { AnimatePresence, motion } from '../../../index.js';

const container = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.08 },
	},
};

const item = {
	hidden: { opacity: 0, y: 16 },
	visible: { opacity: 1, y: 0 },
};
</script>

<AnimatePresence>
	<motion.div initial={false}>
		<motion.ul
			data-testid="ssr-inherited-parent"
			variants={container}
			initial="hidden"
			whileInView="visible"
		>
			<motion.li data-testid="ssr-inherited-child" variants={item}>item</motion.li>
		</motion.ul>
	</motion.div>
</AnimatePresence>
