import { describe, expect, it, vi } from 'vitest';
import type { Batcher } from '../../../frameloop/types.js';
import { handoffOptimizedAppearAnimation } from '../handoff.js';
import { appearAnimationStore, appearComplete, markAppearAnimationComplete } from '../store.js';
import { appearStoreId } from '../store-id.js';

describe('optimized appear handoff', () => {
	it('retains a finished transform until every transform value claims its start time', () => {
		const elementId = 'element';
		const startTime = 100;
		const cancel = vi.fn();
		const postRenderCallbacks: Array<() => void> = [];
		const frame = {
			postRender: (callback: () => void) => postRenderCallbacks.push(callback),
		} as unknown as Batcher;
		const animation = {
			cancel,
			onfinish: null,
			playState: 'finished',
		} as unknown as Animation;
		appearAnimationStore.set(appearStoreId(elementId, 'transform'), { animation, startTime });
		appearComplete.set(elementId, false);

		expect(handoffOptimizedAppearAnimation(elementId, 'x', frame)).toBe(startTime);
		expect(handoffOptimizedAppearAnimation(elementId, 'scale', frame)).toBe(startTime);
		expect(cancel).not.toHaveBeenCalled();

		markAppearAnimationComplete(elementId);

		expect(cancel).not.toHaveBeenCalled();
		while (postRenderCallbacks.length) postRenderCallbacks.shift()?.();

		expect(cancel).toHaveBeenCalledOnce();
		expect(appearAnimationStore.has(appearStoreId(elementId, 'transform'))).toBe(false);
	});
});
