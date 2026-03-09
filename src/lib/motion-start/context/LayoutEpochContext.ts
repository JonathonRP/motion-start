/**
 * A simple counter store that AnimatePresence increments whenever its
 * rendered children change (item added or removed).  Measure.svelte
 * subscribes to it so it can snapshot element positions *before* the DOM
 * is updated — which is the key requirement for FLIP layout animations.
 */
import { writable } from 'svelte/store';

/** Used as the setContext / getContext key. */
export const LayoutEpochContext = Symbol('LayoutEpochContext');

/** Factory — call once per AnimatePresence instance and set in context. */
export const createLayoutEpoch = () => writable(0);
