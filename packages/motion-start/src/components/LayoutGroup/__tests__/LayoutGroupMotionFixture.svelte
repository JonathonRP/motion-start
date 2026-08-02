<script lang="ts">
import { motion } from '../../../index.js';
import LayoutGroup from '../LayoutGroup.svelte';

let width = $state(100);
</script>

<button id="resize-grouped-target" onclick={() => (width = 200)}>resize</button>

<LayoutGroup id="group">
	<motion.div
		id="grouped-layout-target"
		layout
		layoutId="box"
		style={{
			width: `${width}px`,
			height: '100px',
		}}
	/>
</LayoutGroup>
