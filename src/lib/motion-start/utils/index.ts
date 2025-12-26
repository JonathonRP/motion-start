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

// Gesture hooks
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
export {
	type TapGestureHandlers,
	useTapGesture,
} from '../gestures/use-tap-gesture.svelte.js';

// Layout utilities
export { useLayoutId } from './use-layout-id.svelte.js';

// Lifecycle utilities
export { useUnmountEffect } from './use-unmount-effect.svelte.js';

// Core math utilities
export { clamp } from './clamp.js';
export { progress } from './progress.js';
export { wrap } from './wrap.js';
export { pipe } from './pipe.js';

// Animation utilities
export { delay, delayInSeconds } from './delay.js';
export { distance, distance2D } from './distance.js';
export { velocityPerSecond } from './velocity-per-second.js';

// Interpolation
export { interpolate, type InterpolateOptions, type MixerFactory } from './interpolate.js';

// Mix utilities
export {
	mix,
	mixNumber,
	mixColor,
	mixComplex,
	mixVisibility,
	mixImmediate,
	getMixer,
	invisibleValues,
	type Mixer,
} from './mix/index.js';

// Offset utilities
export { defaultOffset } from './offsets/default.js';
export { fillOffset } from './offsets/fill.js';
export { convertOffsetToTimes } from './offsets/time.js';

// Type checking utilities
export { isZeroValueString } from './is-zero-value-string.js';
export { getContextWindow } from './get-context-window.js';
export { hslaToRgba } from './hsla-to-rgba.js';

// Performance utilities
export { memo } from './memo.js';

// Warning utilities
export { warnOnce, hasWarned } from './warn-once.js';

// Svelte 5 hook adapters
export { useConstant } from './use-constant.js';
export { useIsMounted } from './use-is-mounted.js';
export { useIsomorphicEffect } from './use-isomorphic-effect.js';
export { useInstantTransition, disableInstantTransitions } from './use-instant-transition.js';
export { instantAnimationState } from './use-instant-transition-state.js';

// Svelte types
export type { MutableRefObject, RefObject } from './safe-svelte-types.js';

// Reduced motion
export {
	initPrefersReducedMotion,
	prefersReducedMotion,
	hasReducedMotionListener,
	type ReducedMotionState,
} from './reduced-motion/index.js';
