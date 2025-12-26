/**
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/

// Modern function-based API (Svelte 5)
export { useAnimation } from './use-animation.svelte.js';

// Alias for compatibility with framer-motion v11.11.11 API
export { useAnimation as useAnimationControls } from './use-animation.svelte.js';

// Legacy component-based API (backwards compatibility)
export { default as UseAnimation } from "./UseAnimation.svelte";
