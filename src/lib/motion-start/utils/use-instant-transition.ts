import { frame } from '../frameloop/frame.js';
import { instantAnimationState } from './use-instant-transition-state.js';

/**
 * Disables instant transitions by setting the animation state to false
 */
export const disableInstantTransitions = () => {
	instantAnimationState.current = false;
};

/**
 * Hook for managing instant layout transitions
 *
 * In Svelte 5, this would be adapted to use runes:
 * ```ts
 * let renderCount = $state(0);
 *
 * function startInstantTransition(callback: () => void) {
 *   instantAnimationState.current = true;
 *   renderCount++;
 *
 *   const prevRenderCount = renderCount;
 *
 *   frame.postRender(() => {
 *     if (renderCount !== prevRenderCount) return;
 *     frame.postRender(disableInstantTransitions);
 *   });
 *
 *   callback();
 * }
 * ```
 *
 * @returns Function to start an instant transition
 */
export function useInstantTransition() {
	return (callback: () => void) => {
		instantAnimationState.current = true;

		frame.postRender(() => {
			frame.postRender(disableInstantTransitions);
		});

		callback();
	};
}
