import { frame } from '../frameloop';
import { useInstantLayoutTransition } from '../projection/use-instant-layout-transition';
import { useForceUpdate } from './use-force-update.svelte';
import { instantAnimationState } from './use-instant-transition-state';

export function useInstantTransition() {
	const [forceUpdate, forcedRenderCount] = $derived([...useForceUpdate()]);
	const startInstantLayoutTransition = useInstantLayoutTransition();
	let unlockOnFrameRef = -1;

	$effect.pre(() => {
		/**
		 * Unblock after two animation frames, otherwise this will unblock too soon.
		 */
		frame.postRender(() =>
			frame.postRender(() => {
				/**
				 * If the callback has been called again after the effect
				 * triggered this 2 frame delay, don't unblock animations. This
				 * prevents the previous effect from unblocking the current
				 * instant transition too soon. This becomes more likely when
				 * used in conjunction with React.startTransition().
				 */
				if (forcedRenderCount !== unlockOnFrameRef) return;
				instantAnimationState.current = false;
			})
		);
	});

	return (callback: () => void) => {
		startInstantLayoutTransition(() => {
			instantAnimationState.current = true;
			forceUpdate();
			callback();
			unlockOnFrameRef = forcedRenderCount + 1;
		});
	};
}

export function disableInstantTransitions() {
	instantAnimationState.current = false;
}
