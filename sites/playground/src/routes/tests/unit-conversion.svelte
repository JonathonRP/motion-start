<script lang="ts">
import { motion, useCycle, useMotionValue } from 'motion-start';
import { page } from '$app/state';
import type { MotionStyle } from 'motion-start';

const isExternalMotionValue = $derived(page.url.searchParams.get('use-motion-value') || false);

const [x, cycleX] = useCycle<number | string>(0, 'calc(3 * var(--width))');
const xMotionValue = useMotionValue(x());
const value = $derived(isExternalMotionValue ? xMotionValue : undefined);
const style = $derived({
	x: value,
	width: '100px',
	height: '100px',
	background: '#ffaa00',
	'--width': '100px',
}) satisfies MotionStyle;
</script>

<motion.div
	initial={false}
	animate={{ x: x() }}
	transition={{ duration: 5, ease: () => 0.5 }}
	{style}
	onclick={() => cycleX()}
	id="box"
/>
