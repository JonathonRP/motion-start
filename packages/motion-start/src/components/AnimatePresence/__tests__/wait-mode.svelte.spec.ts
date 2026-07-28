import { flushSync, mount, tick, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { nextFrame, waitFor } from '../../../test-utils/component-test-utils.js';
import { MotionGlobalConfig } from '../../../utils/GlobalConfig.js';
import WaitModeFixture from './WaitModeFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;
const originalAnimate = Element.prototype.animate;

beforeEach(() => {
	Element.prototype.animate = ((_keyframes, options) => {
		const duration = typeof options === 'number' ? options : Number(options?.duration ?? 0);
		let cancelled = false;
		const animation = {
			currentTime: 0,
			effect: {},
			onfinish: null as (() => void) | null,
			playState: 'running',
			cancel() {
				cancelled = true;
				this.playState = 'idle';
			},
		};

		setTimeout(() => {
			if (cancelled) return;
			animation.currentTime = duration;
			animation.playState = 'finished';
			animation.onfinish?.();
		}, duration);

		return animation as unknown as Animation;
	}) as typeof Element.prototype.animate;
});

afterEach(async () => {
	if (instance) await unmount(instance);
	instance = undefined;
	Element.prototype.animate = originalAnimate;
	MotionGlobalConfig.skipAnimations = false;
	document.body.innerHTML = '';
});

/**
 * Records how many `.page` elements are laid out at once across the whole
 * transition. `display: none` is treated as not laid out, since `mode="wait"`
 * is allowed to keep a node in the tree as long as it takes up no space.
 */
function trackVisiblePages() {
	const counts: number[] = [];

	const sample = () => {
		const pages = [...document.querySelectorAll('#host .page')] as HTMLElement[];
		counts.push(pages.filter((page) => page.style.display !== 'none').length);
	};

	sample();
	const observer = new MutationObserver(sample);
	observer.observe(document.querySelector('#host') as HTMLElement, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: ['style'],
	});

	return {
		sample,
		stop: () => {
			observer.disconnect();
			return counts;
		},
	};
}

describe('AnimatePresence mode="wait"', () => {
	it('never lays out the incoming child while the outgoing one is still exiting', async () => {
		instance = mount(WaitModeFixture, { target: document.body, props: { mode: 'wait' } });
		flushSync();
		await nextFrame();

		const outgoing = document.querySelector('#host .page') as HTMLElement;
		const tracker = trackVisiblePages();

		(document.querySelector('#advance') as HTMLButtonElement).click();
		flushSync();
		tracker.sample();

		await waitFor(() => !outgoing.isConnected);
		await nextFrame();
		tracker.sample();

		const counts = tracker.stop();
		expect(Math.max(...counts), `laid-out .page counts over time: ${counts.join(',')}`).toBe(1);
	});

	it('still ends with exactly the incoming child', async () => {
		instance = mount(WaitModeFixture, { target: document.body, props: { mode: 'wait' } });
		flushSync();
		await nextFrame();

		const outgoing = document.querySelector('#host .page') as HTMLElement;
		(document.querySelector('#advance') as HTMLButtonElement).click();
		flushSync();

		await waitFor(() => !outgoing.isConnected);
		await nextFrame();

		const pages = [...document.querySelectorAll('#host .page')] as HTMLElement[];
		expect(pages).toHaveLength(1);
		expect(pages[0].dataset.step).toBe('1');
		expect(pages[0].style.display).not.toBe('none');
	});

	it('does not hold back the first child, when nothing is exiting', async () => {
		instance = mount(WaitModeFixture, { target: document.body, props: { mode: 'wait' } });
		flushSync();

		// The incoming node is hidden optimistically, because at intro time
		// nothing knows yet whether an exit is about to start. With no outgoing
		// child, `waitForExit()` resolves straight away, so the node must be back
		// in flow by the time Svelte has settled -- well before the next paint.
		await tick();
		await tick();

		const page = document.querySelector('#host .page') as HTMLElement;
		expect(page.style.display).not.toBe('none');
		expect(page.dataset.motionWaitDisplay).toBeUndefined();
	});

	it('serialises SVG children the same way it serialises HTML children', async () => {
		instance = mount(WaitModeFixture, { target: document.body, props: { mode: 'wait', variant: 'svg' } });
		flushSync();
		await nextFrame();

		const outgoing = document.querySelector('#host .page') as SVGElement;
		expect(outgoing).toBeInstanceOf(SVGElement);
		const tracker = trackVisiblePages();

		(document.querySelector('#advance') as HTMLButtonElement).click();
		flushSync();
		tracker.sample();

		await waitFor(() => !outgoing.isConnected);
		await nextFrame();
		tracker.sample();

		const counts = tracker.stop();
		expect(Math.max(...counts), `laid-out .page counts over time: ${counts.join(',')}`).toBe(1);

		const pages = [...document.querySelectorAll('#host .page')] as SVGElement[];
		expect(pages).toHaveLength(1);
		expect(pages[0].style.display).not.toBe('none');
	});

	it('keeps nested motion elements in flow while their ancestor is still exiting', async () => {
		instance = mount(WaitModeFixture, { target: document.body, props: { mode: 'wait', variant: 'nested' } });
		flushSync();
		await nextFrame();

		const outgoing = document.querySelector('#host .page') as HTMLElement;
		const nested = outgoing.querySelector('.nested') as HTMLElement;

		// A nested motion element has no `exit` of its own, so its exit resolves
		// immediately. Pulling it out of flow there would collapse the outgoing
		// content while the ancestor is still animating out.
		const collapsed: string[] = [];
		const observer = new MutationObserver(() => {
			if (outgoing.isConnected && outgoing.style.display !== 'none' && nested.style.display === 'none') {
				collapsed.push(`${outgoing.style.display || 'in-flow'}/${nested.style.display}`);
			}
		});
		observer.observe(document.querySelector('#host') as HTMLElement, {
			subtree: true,
			attributes: true,
			attributeFilter: ['style'],
		});

		(document.querySelector('#advance') as HTMLButtonElement).click();
		flushSync();

		await waitFor(() => !outgoing.isConnected);
		await nextFrame();
		observer.disconnect();

		expect(collapsed, `nested element hidden while ancestor was visible: ${collapsed.join(',')}`).toHaveLength(0);
	});

	it('leaves out-of-flow children measurable, since they cannot share layout', async () => {
		instance = mount(WaitModeFixture, { target: document.body, props: { mode: 'wait', variant: 'absolute' } });
		flushSync();

		// An absolutely positioned child takes no part in flow, so hiding it
		// would only zero out its box for projection and `onLayoutMeasure`.
		const page = document.querySelector('#host .page') as HTMLElement;
		expect(page.style.display).not.toBe('none');
		expect(page.dataset.motionWaitDisplay).toBeUndefined();

		(document.querySelector('#advance') as HTMLButtonElement).click();
		flushSync();

		const pages = [...document.querySelectorAll('#host .page')] as HTMLElement[];
		for (const candidate of pages) {
			expect(candidate.style.display).not.toBe('none');
		}
	});
});
