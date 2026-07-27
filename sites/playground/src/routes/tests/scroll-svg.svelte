<script lang="ts">
import { motion, useScroll } from 'motion-start';
import type { MotionStyle } from 'motion-start';
import type { RefObject } from '$lib/motion-start/utils/safe-react-types';

let rectRef: SVGRectElement | null = $state(null);
let svgRef: SVGSVGElement | null = $state(null);

const rect = {
	get current() {
		return rectRef;
	},
} satisfies RefObject<Element>;

const svg = {
	get current() {
		return svgRef;
	},
} satisfies RefObject<Element>;

const rectValues = useScroll({
	target: rect,
	offset: ['start end', 'end start'],
});

const svgValues = useScroll({
	target: svg,
	offset: ['start end', 'end start'],
});

const fixed: MotionStyle = {
	position: 'fixed',
	top: '10px',
	left: '10px',
};
</script>

<div style="padding-top: 400px; padding-bottom: 400px;">
	<svg bind:this={svgRef} viewBox="0 0 200 200" width="200" height="200">
		<rect bind:this={rectRef} width="100" height="100" x="50" y="50" fill="red" />
	</svg>
</div>
<motion.div style={{ ...fixed, color: 'white' }} id="rect-progress">
	{rectValues.scrollYProgress.get()}
</motion.div>
<motion.div style={{ ...fixed, top: '50px', color: 'white' }} id="svg-progress">
	{svgValues.scrollYProgress.get()}
</motion.div>
