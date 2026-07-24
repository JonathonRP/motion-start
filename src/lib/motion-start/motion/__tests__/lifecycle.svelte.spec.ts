import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { nextFrame, waitFor } from '../../test-utils/component-test-utils.js';
import GestureLifecycleFixture from './GestureLifecycleFixture.svelte';
import MotionLifecycleFixture from './MotionLifecycleFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;

function click(selector: string) {
	(document.querySelector(selector) as HTMLButtonElement).click();
	flushSync();
}

function count(selector: string) {
	return Number(document.querySelector(selector)?.textContent ?? 0);
}

afterEach(async () => {
	if (instance) await unmount(instance);
	instance = undefined;
	document.body.innerHTML = '';
});

describe('motion component commit lifecycle', () => {
	it('suppresses the initial animation and animates subsequent prop commits', async () => {
		instance = mount(MotionLifecycleFixture, { target: document.body });
		flushSync();
		await nextFrame();

		expect(count('#first-starts')).toBe(0);
		expect(count('#completes')).toBe(0);

		click('#animate-first');
		await waitFor(() => count('#completes') === 1);

		expect(count('#first-starts')).toBe(1);
		expect(count('#updates')).toBeGreaterThan(0);
		expect((document.querySelector('#motion-target') as HTMLElement).style.transform).toContain('100px');
	});

	it('replaces callback subscriptions without animating a no-op rerender', async () => {
		instance = mount(MotionLifecycleFixture, { target: document.body });
		flushSync();
		await nextFrame();

		click('#animate-first');
		await waitFor(() => count('#completes') === 1);

		click('#replace-handler');
		await nextFrame();
		expect(count('#first-starts')).toBe(1);
		expect(count('#second-starts')).toBe(0);
		expect(count('#completes')).toBe(1);

		click('#animate-second');
		await waitFor(() => count('#completes') === 2);

		expect(count('#first-starts')).toBe(1);
		expect(count('#second-starts')).toBe(1);
		expect((document.querySelector('#motion-target') as HTMLElement).style.transform).toContain('200px');
	});

	it('cancels an active animation when the component unmounts', async () => {
		const onComplete = vi.fn();
		instance = mount(MotionLifecycleFixture, {
			target: document.body,
			props: { onExternalComplete: onComplete },
		});
		flushSync();
		await nextFrame();

		click('#animate-long');
		await nextFrame();
		await unmount(instance);
		instance = undefined;
		await new Promise((resolve) => setTimeout(resolve, 250));

		expect(onComplete).not.toHaveBeenCalled();
	});
});

describe('motion gesture event lifecycle', () => {
	it('wires tap and hover callbacks through the mounted feature attachments', async () => {
		const onTap = vi.fn();
		const onTapStart = vi.fn();
		const onHoverStart = vi.fn();
		const onHoverEnd = vi.fn();
		instance = mount(GestureLifecycleFixture, {
			target: document.body,
			props: { onTap, onTapStart, onHoverStart, onHoverEnd },
		});
		flushSync();
		await nextFrame();
		flushSync();

		const target = document.querySelector('#gesture-target')!;
		target.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true, pointerType: 'mouse' }));
		target.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true, pointerType: 'mouse' }));
		target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse' }));
		target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'mouse' }));

		await waitFor(() => onTap.mock.calls.length === 1 && onHoverEnd.mock.calls.length === 1);

		expect(onTapStart).toHaveBeenCalledTimes(1);
		expect(onTap).toHaveBeenCalledTimes(1);
		expect(onHoverStart).toHaveBeenCalledTimes(1);
		expect(onHoverEnd).toHaveBeenCalledTimes(1);
	});

	it('removes feature event attachments when the motion component unmounts', async () => {
		const onTapStart = vi.fn();
		instance = mount(GestureLifecycleFixture, {
			target: document.body,
			props: { onTapStart },
		});
		flushSync();
		await nextFrame();
		flushSync();

		const target = document.querySelector('#gesture-target')!;
		await unmount(instance);
		instance = undefined;
		target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse' }));
		await nextFrame();

		expect(onTapStart).not.toHaveBeenCalled();
	});
});
