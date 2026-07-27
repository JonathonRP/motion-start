<script lang="ts">
import { motion } from '../../index.js';

let width = $state(100);
</script>

<button id="resize-layout-target" onclick={() => (width = 200)}>resize</button>
<motion.div
	id="layout-target"
	layout
	style={{
		width: `${width}px`,
		height: '100px',
		overflow: 'scroll',
	}}
/>
