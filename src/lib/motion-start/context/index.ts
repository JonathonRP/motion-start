/**
 * Motion Context System
 * Modern Svelte 5 contexts using createContext
 *
 * @module context
 */

// Motion Context
export {
    motionContext,
    useVisualElement,
    useMotionContext,
    type MotionContextValue,
} from './motion-context.svelte.js';

// Presence Context
export {
    presenceContext,
    usePresence,
    isPresent,
    type PresenceContextValue,
} from './presence-context.svelte.js';

// Motion Config Context
export {
    motionConfigContext,
    useMotionConfig,
    type MotionConfigContextValue,
    type TransformPoint2D,
} from './motion-config-context.svelte.js';

// Lazy Context
export {
    lazyContext,
    useLazyContext,
    type LazyContextValue,
} from './lazy-context.svelte.js';

// Layout Group Context
export {
    layoutGroupContext,
    useLayoutGroup,
} from './layout-group-context.svelte.js';
