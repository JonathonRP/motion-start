<script lang="ts">
import { AnimatePresence, motion } from '../../../index.js';
</script>

<AnimatePresence initial={false}>
	<motion.div
		appear
		data-testid="ssr-blocked-appear"
		initial={{ opacity: 0 }}
		animate={{ opacity: [0, 0.5, 1] }}
		transition={{ type: 'keyframes', duration: 0.4 }}
	/>
</AnimatePresence>
