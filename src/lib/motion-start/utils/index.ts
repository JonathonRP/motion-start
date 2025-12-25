/**
 * Motion Utilities
 * Runes-based utility functions for motion-start
 *
 * @module utils
 */

// Core utilities
export {
    useUnmountEffect,
} from './use-unmount-effect.svelte.js';

export {
    useLayoutId,
} from './use-layout-id.svelte.js';

// Event utilities
export {
    useDomEvent,
    addDomEvent,
} from '../events/use-dom-event.svelte.js';

// Gesture hooks
export {
    useTapGesture,
    type TapGestureHandlers,
} from '../gestures/use-tap-gesture.svelte.js';

export {
    useHoverGesture,
    type HoverGestureHandlers,
} from '../gestures/use-hover-gesture.svelte.js';

export {
    useFocusGesture,
    type FocusGestureHandlers,
} from '../gestures/use-focus-gesture.svelte.js';

export {
    usePanGesture,
    type PanGestureHandlers,
} from '../gestures/use-pan-gesture.svelte.js';

export {
    useDrag,
    type DragGestureHandlers,
} from '../gestures/drag/use-drag.svelte.js';

// Animation controls
export {
    useAnimation,
} from '../animation/use-animation.svelte.js';
