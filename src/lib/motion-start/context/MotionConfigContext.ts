/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { createContext } from 'svelte';
import type { Transition } from '../types.js';

export type ReducedMotionConfig = 'always' | 'never' | 'user';

/**
 * Transform a point from page coordinates
 */
export type TransformPoint = (point: { x: number; y: number }) => { x: number; y: number };

/**
 * @public
 */
export interface MotionConfigContext {
	/**
	 * Internal, exported only for usage in Framer
	 */
	transformPagePoint: TransformPoint;

	/**
	 * Internal. Determines whether this is a static context ie the Framer canvas. If so,
	 * it'll disable all dynamic functionality.
	 */
	isStatic: boolean;

	/**
	 * Defines a new default transition for the entire tree.
	 *
	 * @public
	 */
	transition?: Transition;

	/**
	 * If true, will respect the device prefersReducedMotion setting by switching
	 * transform animations off.
	 *
	 * @public
	 */
	reducedMotion?: ReducedMotionConfig;

	/**
	 * A custom `nonce` attribute used when wanting to enforce a Content Security Policy (CSP).
	 * For more details see:
	 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src#unsafe_inline_styles
	 *
	 * @public
	 */
	nonce?: string;
}

const DEFAULT_CONFIG: MotionConfigContext = {
	transformPagePoint: (p: { x: number; y: number }) => p,
	isStatic: false,
	reducedMotion: 'never',
};

/**
 * Motion config context created with Svelte 5's createContext
 * @internal
 */
const [getMotionConfigContext, setMotionConfigContext] = createContext<MotionConfigContext>();

/**
 * Motion config context - provides configuration to motion components
 * @public
 */
export const MotionConfigContext = {
	/**
	 * Set motion config context value and return it
	 */
	set(value: MotionConfigContext): MotionConfigContext {
		return setMotionConfigContext(value);
	},

	/**
	 * Get motion config context value (returns default if not in context)
	 */
	get(): MotionConfigContext {
		try {
			return getMotionConfigContext();
		} catch {
			return DEFAULT_CONFIG;
		}
	},
};

/**
 * Type alias for backwards compatibility
 * @public
 */
export type { MotionConfigContext as MotionConfigContextObject };

/**
 * Context key for backwards compatibility
 * @public
 */
export const MOTION_CONFIG_CONTEXT_KEY = MotionConfigContext;
