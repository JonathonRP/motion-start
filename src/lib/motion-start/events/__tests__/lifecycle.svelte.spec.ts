import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { motionValue } from '../../value/index.js';
import ReactiveDomEventFixture from './ReactiveDomEventFixture.svelte';
import ReactiveMotionValueEventFixture from './ReactiveMotionValueEventFixture.svelte';
import UseDomEventFixture from './UseDomEventFixture.svelte';
import UseMotionValueEventFixture from './UseMotionValueEventFixture.svelte';

const mounted: Array<ReturnType<typeof mount>> = [];

afterEach(async () => {
	while (mounted.length) {
		await unmount(mounted.pop()!);
	}
	document.body.innerHTML = '';
});

describe('useDomEvent', () => {
	it('does nothing when the ref has no target', () => {
		const handler = vi.fn();
		mounted.push(mount(UseDomEventFixture, { target: document.body, props: { eventTarget: null, handler } }));
		flushSync();

		document.body.dispatchEvent(new PointerEvent('pointerdown'));

		expect(handler).not.toHaveBeenCalled();
	});

	it('attaches the listener to the referenced target', () => {
		const handler = vi.fn();
		mounted.push(mount(UseDomEventFixture, { target: document.body, props: { eventTarget: document.body, handler } }));
		flushSync();

		document.body.dispatchEvent(new PointerEvent('pointerdown'));

		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('removes the listener when its component unmounts', async () => {
		const handler = vi.fn();
		const instance = mount(UseDomEventFixture, {
			target: document.body,
			props: { eventTarget: document.body, handler },
		});
		mounted.push(instance);
		flushSync();

		document.body.dispatchEvent(new PointerEvent('pointerdown'));
		expect(handler).toHaveBeenCalledTimes(1);

		await unmount(instance);
		mounted.splice(mounted.indexOf(instance), 1);
		document.body.dispatchEvent(new PointerEvent('pointerdown'));

		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('retargets the listener and dispatches to the latest handler state', () => {
		mounted.push(mount(ReactiveDomEventFixture, { target: document.body }));
		flushSync();
		const first = document.querySelector('#first-dom-target')!;
		const second = document.querySelector('#second-dom-target')!;

		first.dispatchEvent(new PointerEvent('pointerdown'));
		flushSync();
		expect(document.querySelector('#first-dom-calls')?.textContent).toBe('1');

		(document.querySelector('#replace-dom-handler') as HTMLButtonElement).click();
		flushSync();
		first.dispatchEvent(new PointerEvent('pointerdown'));
		flushSync();
		expect(document.querySelector('#second-dom-calls')?.textContent).toBe('1');

		(document.querySelector('#retarget-dom-event') as HTMLButtonElement).click();
		flushSync();
		first.dispatchEvent(new PointerEvent('pointerdown'));
		second.dispatchEvent(new PointerEvent('pointerdown'));
		flushSync();

		expect(document.querySelector('#second-dom-calls')?.textContent).toBe('2');
	});
});

describe('useMotionValueEvent', () => {
	it('subscribes during component setup and unsubscribes on destroy', async () => {
		const value = motionValue(0);
		const handler = vi.fn();
		const instance = mount(UseMotionValueEventFixture, { target: document.body, props: { value, handler } });
		mounted.push(instance);
		flushSync();

		value.set(1);
		expect(handler).toHaveBeenCalledTimes(1);
		expect(handler.mock.calls[0][0]).toBe(1);

		await unmount(instance);
		mounted.splice(mounted.indexOf(instance), 1);
		value.set(2);

		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('moves the subscription when a reactive MotionValue source changes', () => {
		const first = motionValue(0);
		const second = motionValue(0);
		const handler = vi.fn();
		mounted.push(mount(ReactiveMotionValueEventFixture, { target: document.body, props: { first, second, handler } }));
		flushSync();

		first.set(1);
		expect(handler.mock.calls.map(([latest]) => latest)).toEqual([1]);

		(document.querySelector('#switch-motion-value') as HTMLButtonElement).click();
		flushSync();
		first.set(2);
		second.set(3);

		expect(handler.mock.calls.map(([latest]) => latest)).toEqual([1, 3]);
	});
});
