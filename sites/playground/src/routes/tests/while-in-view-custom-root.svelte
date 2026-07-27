<script lang="ts">
import { motion } from 'motion-start';
import type { MotionStyle } from 'motion-start';
import type { RefObject } from '$lib/motion-start/utils/safe-react-types';

let containerRef: HTMLDivElement | null = $state(null);

const root = {
	get current() {
		return containerRef;
	},
} satisfies RefObject<Element>;

const boxStyle: MotionStyle = { width: '100px', height: '100px', flexShrink: 0 };
</script>

<div id="container" bind:this={containerRef} style="width: 300px; overflow: scroll; display: flex;">
	<div style="flex: 0 0 400px;"></div>
	<motion.div
		id="box"
		initial={false}
		transition={{ duration: 0.01 }}
		animate={{ background: 'rgba(255,0,0,1)' }}
		whileInView={{ background: 'rgba(0,255,0,1)' }}
		viewport={{ root }}
		style={boxStyle}
	/>
</div>
