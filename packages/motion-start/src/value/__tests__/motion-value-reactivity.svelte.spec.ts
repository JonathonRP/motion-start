import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { animate } from '../../animation/animate/index.js';
import { frame } from '../../frameloop/index.js';
import { collectMotionValues, type MotionValue, motionValue } from '../index.js';
import MotionValueReactiveReadsFixture from './MotionValueReactiveReadsFixture.svelte';

const subscriptionManagers = vi.hoisted(() => ({ constructed: 0 }));

vi.mock('../../utils/subscription-manager.js', async (importOriginal) => {
	const actual = await importOriginal<typeof import('../../utils/subscription-manager.js')>();

	return {
		...actual,
		SubscriptionManager: new Proxy(actual.SubscriptionManager, {
			construct(target, args) {
				subscriptionManagers.constructed++;
				return Reflect.construct(target, args);
			},
		}),
	};
});

let instance: ReturnType<typeof mount> | undefined;

afterEach(async () => {
	if (instance) await unmount(instance);
	instance = undefined;
	document.body.innerHTML = '';
	collectMotionValues.current = undefined;
});

describe('MotionValue reactive reads', () => {
	it('reruns effects that read current and preserves reactive get compatibility', () => {
		const value = motionValue(0);
		const oncurrent = vi.fn();
		const onget = vi.fn();

		instance = mount(MotionValueReactiveReadsFixture, {
			target: document.body,
			props: { value, oncurrent, onget },
		});
		flushSync();

		value.set(1);
		flushSync();

		expect({
			currentReads: oncurrent.mock.calls,
			imperativeReads: onget.mock.calls,
		}).toEqual({
			currentReads: [[0], [1]],
			imperativeReads: [[0], [1]],
		});
	});

	it('continues collecting imperative get reads for computed MotionValues', () => {
		const value = motionValue(0);
		const collected: MotionValue[] = [];
		collectMotionValues.current = collected;

		value.get();

		expect(collected).toEqual([value]);
	});

	it('does not stop an animation when a component that reactively read current unmounts', async () => {
		const value = motionValue(0);

		animate(value, 100, { duration: 10 });
		expect(value.isAnimating()).toBe(true);

		const component = mount(MotionValueReactiveReadsFixture, {
			target: document.body,
			props: { value, oncurrent: vi.fn(), onget: vi.fn() },
		});
		flushSync();

		await unmount(component);
		flushSync();

		// Auto-stopping runs on the next read step, so give the frameloop a chance
		// to process the teardown before asserting.
		await new Promise<void>((resolve) => {
			frame.postRender(() => resolve());
		});

		expect(value.isAnimating()).toBe(true);

		value.stop();
	});

	it('allocates the reactive subscription manager only once current is read reactively', () => {
		subscriptionManagers.constructed = 0;

		const value = motionValue(0);
		value.set(1);

		// A MotionValue that is never read inside a $derived/$effect and has no
		// event listeners should not allocate a SubscriptionManager at all.
		expect(subscriptionManagers.constructed).toBe(0);

		instance = mount(MotionValueReactiveReadsFixture, {
			target: document.body,
			props: { value, oncurrent: vi.fn(), onget: vi.fn() },
		});
		flushSync();

		expect(subscriptionManagers.constructed).toBe(1);
	});
});
