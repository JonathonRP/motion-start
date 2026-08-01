<svelte:options runes />

<script lang="ts">
import { motion } from '../../../index.js';
</script>

<motion.div
	data-testid="ssr-motion"
	style={{
		backgroundColor: 'tomato',
		backgroundImage: '\\',
		color: 'red; position: fixed',
		WebkitFilter: 'blur(1px)'
	}}
	initial={{ opacity: 0.25, x: 24, '--accentColor': 'rebeccapurple' }}
	animate={{ opacity: 1, x: 0 }}
>
	server rendered
</motion.div>
