<script lang="ts">
import { useScroll, motion, useMotionValueEvent } from 'motion-start';
import type { RefObject } from 'motion-start/utils/safe-react-types';

let containerRef: HTMLDivElement | null = $state(null);
let targetRef: HTMLDivElement | null = $state(null);

const container = {
	get current() {
		return containerRef;
	},
} satisfies RefObject<HTMLElement>;

const target = {
	get current() {
		return targetRef;
	},
} satisfies RefObject<HTMLElement>;

const { scrollYProgress } = useScroll({
	container,
	target,
	offset: ['start start', 'end start'],
});

useMotionValueEvent(scrollYProgress, 'change', console.log);
</script>

<div style="height: 100px; width: 100px;"></div>
<div
	id="container"
	bind:this={containerRef}
	style="overflow-y: auto; height: 300px; width: 300px; position: relative;"
>
	<div style="height: 1000px; width: 300px; background: red;">
		<div
			bind:this={targetRef}
			style="width: 100px; height: 100px; font-size: 24px; display: flex; background: white;"
		>
			<motion.span id="label">{scrollYProgress.get()}</motion.span>
		</div>
	</div>
</div>
