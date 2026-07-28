<script lang="ts">
/**
 * An example of animating between different value types
 */
import { motion } from 'motion-start';
</script>

<motion.div
	animate={{ height: '50vh', width: '100px' }}
	transition={{ duration: 5, ease: () => 0.5 }}
	style={{ width: '50vw', height: '100px', background: '#ffaa00' }}
	id="box"
/>
