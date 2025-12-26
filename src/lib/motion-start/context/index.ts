/**
 * Motion Context System
 * Modern Svelte 5 contexts using createContext
 *
 * @module context
 */

// Layout Group Context
export {
	layoutGroupContext,
	useLayoutGroup,
} from './layout-group-context.svelte.js';
// Lazy Context
export {
	type LazyContextValue,
	lazyContext,
	useLazyContext,
} from './lazy-context.svelte.js';

// Motion Config Context
export {
	type MotionConfigContextValue,
	motionConfigContext,
	type TransformPoint2D,
	useMotionConfig,
} from './motion-config-context.svelte.js';
// Motion Context
export {
	type MotionContextValue,
	motionContext,
	useMotionContext,
	useVisualElement,
} from './motion-context.svelte.js';
// Presence Context
export {
	isPresent,
	type PresenceContextValue,
	presenceContext,
	usePresence,
} from './presence-context.svelte.js';
