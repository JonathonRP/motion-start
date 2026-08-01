<script lang="ts">
import { motion } from '../../../index.js';
</script>

<motion.div
	appear
	data-testid="appear-handoff"
	initial={{ opacity: 0, x: 20 }}
	animate={{ opacity: 1, x: 0 }}
	transition={{ type: 'tween', duration: 0.4 }}
/>
