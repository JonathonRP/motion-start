<script lang="ts">
import { motion } from 'motion-start';
import { page } from '$app/state';
import type { MotionStyle } from 'motion-start';
import type { ViewportOptions } from 'motion-start/motion/features/viewport/types';

const amount = $derived((page.url.searchParams.get('amount') as ViewportOptions['amount'] | null) || undefined);
const once = $derived(page.url.searchParams.get('once') ? true : undefined);
const margin = $derived(page.url.searchParams.get('margin') || undefined);
const deleteObserver = page.url.searchParams.get('delete') || undefined;
const disableFallback = $derived(page.url.searchParams.get('disableFallback') || false);
const boxStyle: MotionStyle = { width: '100px', height: '100px' };

let inViewport = $state(false);

if (deleteObserver) {
	window.IntersectionObserver = undefined as unknown as typeof window.IntersectionObserver;
}
</script>

<div style="padding-top: 700px;">
	<motion.div
		id="box"
		initial={false}
		transition={{ duration: 0.01 }}
		animate={{ background: 'rgba(255,0,0,1)' }}
		whileInView={{ background: 'rgba(0,255,0,1)' }}
		viewport={{ amount, once, margin, fallback: !disableFallback } as ViewportOptions & { fallback: boolean }}
		style={boxStyle}
		onViewportEnter={() => (inViewport = true)}
		onViewportLeave={() => (inViewport = false)}
	>
		{inViewport ? 'In' : 'Out'}
	</motion.div>
</div>
