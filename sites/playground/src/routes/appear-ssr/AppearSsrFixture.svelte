<svelte:options runes />

<script lang="ts">
import { motion } from 'motion-start';
</script>

<motion.div
	appear={{ nonce: 'appear-e2e-nonce' }}
	id="appear-ssr"
	initial={{ opacity: 0, x: 20 }}
	animate={{ opacity: 1, x: 0 }}
	transition={{ type: 'tween', duration: 10, ease: 'linear' }}
>
	Server-rendered appear animation
</motion.div>
