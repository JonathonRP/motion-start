import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { collectMotionValues, type MotionValue, motionValue } from '../index.js';
import MotionValueReactiveReadsFixture from './MotionValueReactiveReadsFixture.svelte';

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
});
