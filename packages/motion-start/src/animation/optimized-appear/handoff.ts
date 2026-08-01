/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { Batcher } from '../../frameloop/types.js';
import { appearAnimationStore } from './store.js';
import { appearStoreId } from './store-id.js';

export function handoffOptimizedAppearAnimation(elementId: string, valueName: string, frame: Batcher): number | null {
	const storeId = appearStoreId(elementId, valueName);
	const optimisedAnimation = appearAnimationStore.get(storeId);

	if (!optimisedAnimation) {
		return null;
	}

	const { animation, startTime } = optimisedAnimation;

	function cancelAnimation() {
		window.MotionCancelOptimisedAnimation?.(elementId, valueName, frame);
	}

	/**
	 * We can cancel the animation once it's finished now that we've synced
	 * with Motion.
	 *
	 * Prefer onfinish over finished as onfinish is backwards compatible with
	 * older browsers.
	 */
	if (startTime === null || window.MotionHandoffIsComplete?.(elementId)) {
		/**
		 * If the startTime is null, this animation is the Paint Ready detection animation
		 * and we can cancel it immediately without handoff.
		 *
		 * Or if we've already handed off the animation then we're now interrupting it.
		 * In which case we need to cancel it.
		 */
		cancelAnimation();
		return null;
	}

	// A transform animation is shared by every transform value. Keep a finished
	// entry available through synchronous target resolution, then clean it up
	// after Motion has rendered the handed-off values.
	if (animation.playState === 'finished') {
		frame.postRender(() => {
			frame.postRender(() => {
				if (appearAnimationStore.get(storeId)?.animation !== animation) return;
				animation.cancel();
				appearAnimationStore.delete(storeId);
				if (!appearAnimationStore.size) window.MotionCancelOptimisedAnimation = undefined;
			});
		});
		return startTime;
	}

	animation.onfinish = cancelAnimation;
	return startTime;
}
