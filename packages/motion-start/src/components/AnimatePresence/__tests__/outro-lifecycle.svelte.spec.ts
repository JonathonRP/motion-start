import { flushSync, mount, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { visualElementStore } from '../../../render/store.js';
import { nextFrame, waitFor } from '../../../test-utils/component-test-utils.js';
import { MotionGlobalConfig } from '../../../utils/GlobalConfig.js';
import OutroLifecycleFixture from './OutroLifecycleFixture.svelte';

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

function click(selector: string) {
	(document.querySelector(selector) as HTMLButtonElement).click();
	flushSync();
}

afterEach(async () => {
	if (instance) await unmount(instance);
	instance = undefined;
	Element.prototype.animate = originalAnimate;
	MotionGlobalConfig.skipAnimations = false;
	document.body.innerHTML = '';
});

describe('AnimatePresence Svelte outro lifecycle', () => {
	it('commits and retains the final exit style until DOM removal', async () => {
		MotionGlobalConfig.skipAnimations = true;
		instance = mount(OutroLifecycleFixture, { target: document.body });
		flushSync();
		await nextFrame();

		const target = document.querySelector('#exit-target') as HTMLElement;
		const visualElement = visualElementStore.get(target);
		const styles: string[] = [target.getAttribute('style') ?? ''];
		const record = () => {
			styles.push(target.getAttribute('style') ?? '');
		};
		const observer = new MutationObserver(record);
		observer.observe(target, { attributes: true, attributeFilter: ['style'] });
		click('#remove-exit');

		expect(target.isConnected).toBe(true);
		await waitFor(() => !target.isConnected);
		// Records queued but not yet delivered would otherwise be dropped by
		// `disconnect()`, losing the final committed style.
		if (observer.takeRecords().length > 0) record();
		observer.disconnect();

		expect(target.style.opacity, `${styles.join('\n')}\nlatest=${String(visualElement?.latestValues.opacity)}`).toBe(
			'0'
		);
		expect(target.style.width).toBe('100px');

		const finalStyleIndex = styles.findIndex((style) => /(?:^|;\s*)opacity:\s*0(?:;|$)/.test(style));
		expect(finalStyleIndex).toBeGreaterThanOrEqual(0);
		expect(styles.slice(finalStyleIndex).some((style) => /(?:^|;\s*)opacity:\s*1(?:;|$)/.test(style))).toBe(false);
	});

	it('retains a layoutId-only node for its layout transition', async () => {
		MotionGlobalConfig.skipAnimations = true;
		instance = mount(OutroLifecycleFixture, { target: document.body });
		flushSync();
		await nextFrame();

		const target = document.querySelector('#layout-exit-target') as HTMLElement;
		click('#remove-layout');

		expect(target.isConnected).toBe(true);
		await waitFor(() => !target.isConnected);
	});
});
