/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

// Legacy component-based API (backwards compatibility)
export { default as UseAnimation } from './UseAnimation.svelte';
// Modern function-based API (Svelte 5)
// Alias for compatibility with framer-motion v11.11.11 API
export { useAnimation, useAnimation as useAnimationControls } from './use-animation.svelte.js';
