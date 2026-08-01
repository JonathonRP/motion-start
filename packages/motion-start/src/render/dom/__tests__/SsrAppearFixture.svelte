<script lang="ts">
import { motion } from '../../../index.js';

const scriptEnd = '</' + 'script>';
const unsafeEase = `${scriptEnd}<script>globalThis.__appearInjected = true${scriptEnd}<script>` as unknown as 'easeOut';
</script>

<motion.div
	appear={{ nonce: 'appear-nonce' }}
	data-testid="ssr-appear-tween"
	initial={{ opacity: 0, x: 20 }}
	animate={{ opacity: 1, x: 0 }}
	transition={{ type: 'tween', duration: 0.4, ease: 'easeOut' }}
>
	tween
</motion.div>

<motion.div
	appear
	data-testid="ssr-appear-keyframes"
	initial={{ opacity: 0 }}
	animate={{ opacity: [0, 0.5, 1] }}
	transition={{
		type: 'keyframes',
		values: [0, 0.5, 1],
		duration: 0.6,
		times: [0, 0.25, 1],
		ease: ['linear', 'easeOut']
	}}
>
	keyframes
</motion.div>

<motion.div
	appear
	data-testid="ssr-appear-implicit-ease"
	initial={{ opacity: 0, x: 20 }}
	animate={{ opacity: 1, x: 0 }}
	transition={{ type: 'tween', duration: 0.4 }}
>
	implicit ease
</motion.div>

<motion.svg
	appear
	data-testid="ssr-appear-svg"
	initial={{ opacity: 0 }}
	animate={{ opacity: 1 }}
	transition={{ type: 'tween', duration: 0.4, ease: 'easeOut' }}
/>

<motion.div
	data-testid="ssr-appear-opted-out"
	initial={{ opacity: 0 }}
	animate={{ opacity: 1 }}
	transition={{ type: 'tween', duration: 0.4 }}
>
	opted out
</motion.div>

<motion.div
	appear
	data-testid="ssr-appear-spring"
	initial={{ opacity: 0, x: 20 }}
	animate={{ opacity: 1, x: 0 }}
	transition={{ type: 'spring', stiffness: 200 }}
>
	spring fallback
</motion.div>

<motion.div
	appear
	data-testid="ssr-appear-unsafe"
	initial={{ opacity: 0 }}
	animate={{ opacity: 1 }}
	transition={{ type: 'tween', duration: 0.4, ease: unsafeEase }}
>
	unsafe fallback
</motion.div>
