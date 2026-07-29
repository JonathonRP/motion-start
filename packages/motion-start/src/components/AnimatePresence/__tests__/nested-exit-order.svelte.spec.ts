import { flushSync, mount, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { waitFor } from '../../../test-utils/component-test-utils.js';
import NestedExitOrderFixture from './NestedExitOrderFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;
const originalAnimate = Element.prototype.animate;

beforeEach(() => {
	Element.prototype.animate = ((_keyframes: unknown, options: unknown) => {
		const duration = typeof options === 'number' ? options : Number((options as { duration?: number })?.duration ?? 0);
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
	document.body.innerHTML = '';
});

describe('AnimatePresence nested exit ordering', () => {
	it('completes a child variant before its afterChildren parent, and both before removal', async () => {
		const order: string[] = [];
		instance = mount(NestedExitOrderFixture, { target: document.body, props: { order } });
		flushSync();
		await new Promise((resolve) => setTimeout(resolve, 50));

		const parent = document.querySelector('#nested-exit-parent') as HTMLElement;
		(document.querySelector('#remove-nested') as HTMLButtonElement).click();
		flushSync();

		// The exiting element is unmounted with the retained block, and unmounting
		// clears its event subscriptions - so anything not notified by then is lost.
		await waitFor(() => !parent.isConnected, 3000);
		const orderAtRemoval = [...order];

		expect(orderAtRemoval).toEqual(['child', 'parent']);
	});
});
