/**
 * Motion Utilities
 * Runes-based utility functions for motion-start
 *
 * @module utils
 */

// Animation controls
export { useAnimation } from '../animation/use-animation.svelte.js';
// Event utilities
export {
	addDomEvent,
	useDomEvent,
} from '../events/use-dom-event.svelte.js';
export {
	type DragGestureHandlers,
	useDrag,
} from '../gestures/drag/use-drag.svelte.js';
export {
	type FocusGestureHandlers,
	useFocusGesture,
} from '../gestures/use-focus-gesture.svelte.js';

export {
	type HoverGestureHandlers,
	useHoverGesture,
} from '../gestures/use-hover-gesture.svelte.js';
export {
	type PanGestureHandlers,
	usePanGesture,
} from '../gestures/use-pan-gesture.svelte.js';
// Gesture hooks
export {
	type TapGestureHandlers,
	useTapGesture,
} from '../gestures/use-tap-gesture.svelte.js';
export { useLayoutId } from './use-layout-id.svelte.js';
// Core utilities
export { useUnmountEffect } from './use-unmount-effect.svelte.js';
