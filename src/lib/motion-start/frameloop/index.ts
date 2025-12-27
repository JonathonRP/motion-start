/**
 * Frameloop Module Entry Point
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Main export point for the frameloop system.
 * Re-exports the frame scheduler and related utilities.
 */

export * from './frame.js';
export { microtask, cancelMicrotask } from './microtask.js';
