import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { visualElementStore } from '../../../render/store.js';
import { nextFrame } from '../../../test-utils/component-test-utils.js';
import LayoutGroupMotionFixture from './LayoutGroupMotionFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;

afterEach(async () => {
	if (instance) await unmount(instance);
	instance = undefined;
	document.body.innerHTML = '';
});

describe('motion layoutId inside a LayoutGroup', () => {
	it('keeps the LayoutGroup prefix across prop changes', async () => {
		instance = mount(LayoutGroupMotionFixture, { target: document.body });
		flushSync();
		await nextFrame();

		const target = document.querySelector('#grouped-layout-target') as HTMLElement;
		const visualElement = visualElementStore.get(target);
		expect(visualElement?.getProps().layoutId).toBe('group-box');

		(document.querySelector('#resize-grouped-target') as HTMLButtonElement).click();
		flushSync();
		await nextFrame();

		// Guard: the props recompute the regression depends on actually happened.
		expect(visualElement?.getProps().style?.width).toBe('200px');

		// The layout group id must survive a props recompute. Reading it from a
		// `getContext` call inside a `$derived` silently degrades to the
		// unprefixed id after the first evaluation.
		expect(visualElement?.getProps().layoutId).toBe('group-box');
		expect(visualElement?.projection?.options.layoutId).toBe('group-box');
	});
});
