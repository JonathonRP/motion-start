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
const staggeredChildren = $derived(page.url.searchParams.get('staggeredChildren') === 'true');
const boxStyle: MotionStyle = { width: '100px', height: '100px' };
const staggeredListStyle: MotionStyle = {
	display: 'flex',
	gap: '12px',
	padding: '0',
	margin: '0',
	listStyle: 'none',
};
const staggeredItemStyle: MotionStyle = {
	width: '56px',
	height: '56px',
	display: 'grid',
	placeItems: 'center',
	borderRadius: '12px',
	background: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(147, 197, 253))',
	color: 'white',
	fontFamily: 'monospace',
	fontSize: '14px',
};
const container = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.08, delayChildren: 0.1 },
	},
};
const item = {
	hidden: { opacity: 0, y: 16 },
	// Keep intermediate frames observable when headless Electron throttles timers.
	visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'linear' } },
};
const staggerItems = [1, 2, 3, 4, 5];

type StaggerUpdate = {
	opacity: number;
	time: number;
	y: number;
};

type StaggerWindow = Window & {
	__staggerUpdates?: Record<number, StaggerUpdate[]>;
};

function recordStaggerUpdate(number: number, latest: Record<string, string | number>) {
	const staggerWindow = window as StaggerWindow;
	let updates = staggerWindow.__staggerUpdates;
	if (!updates) {
		updates = {};
		staggerWindow.__staggerUpdates = updates;
	}

	let itemUpdates = updates[number];
	if (!itemUpdates) {
		itemUpdates = [];
		updates[number] = itemUpdates;
	}
	itemUpdates.push({
		opacity: Number(latest.opacity),
		time: performance.now(),
		y: Number(latest.y),
	});
}

let inViewport = $state(false);

if (deleteObserver) {
	window.IntersectionObserver = undefined as unknown as typeof window.IntersectionObserver;
}
</script>

{#if staggeredChildren}
	<div style="padding-top: 140vh; padding-bottom: 140vh;">
		<motion.ul
			id="staggered-list"
			variants={container}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: false, amount: 0.6 }}
			style={staggeredListStyle}
		>
			{#each staggerItems as number (number)}
				<motion.li
					id={`staggered-item-${number}`}
					data-stagger-item
					variants={item}
					style={staggeredItemStyle}
					onUpdate={(latest) => recordStaggerUpdate(number, latest)}
				>
					{number}
				</motion.li>
			{/each}
		</motion.ul>
	</div>
{:else}
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
{/if}
