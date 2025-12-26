/**
 * Frameloop Legacy API
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Provides backward-compatible deprecated APIs for legacy code.
 * New code should use the `frame` and `cancelFrame` exports instead.
 */

import { frame, cancelFrame } from './index.js';
import { stepsOrder } from './batcher.js';
import type { Process } from './types.js';

/**
 * @deprecated
 *
 * Import as `frame` instead.
 */
export const sync = frame;

/**
 * @deprecated
 *
 * Use cancelFrame(callback) instead.
 */
export const cancelSync = stepsOrder.reduce((acc, key) => {
	acc[key] = (process: Process) => cancelFrame(process);
	return acc;
}, {} as Record<string, (process: Process) => void>);
