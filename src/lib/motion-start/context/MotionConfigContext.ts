/**
 * @deprecated Use motion-config-context.svelte.ts instead
 * This file re-exports from the new Svelte 5 implementation for backwards compatibility
 *
 * based on framer-motion@11.11.11,
 * Copyright (c) 2018 Framer B.V.
 */

import {
	motionConfigContext,
	useMotionConfig,
	type MotionConfigContextValue,
	type ReducedMotionConfig as ReducedMotionConfigType,
	type TransformPoint2D,
} from './motion-config-context.svelte.js';

/**
 * @deprecated Use ReducedMotionConfig from motion-config-context.svelte.ts
 * @public
 */
export type ReducedMotionConfig = ReducedMotionConfigType;

/**
 * Transform a point from page coordinates
 * @deprecated Use TransformPoint2D from motion-config-context.svelte.ts
 * @public
 */
export type TransformPoint = TransformPoint2D;

/**
 * Motion configuration context interface
 * @deprecated Use MotionConfigContextValue from motion-config-context.svelte.ts
 * @public
 */
export interface MotionConfigContext extends MotionConfigContextValue {
	transformPagePoint: TransformPoint;
	isStatic: boolean;
}

/**
 * Motion config context - provides configuration to motion components
 * @deprecated Use motionConfigContext from motion-config-context.svelte.ts
 * @public
 */
export const MotionConfigContext = motionConfigContext as any;

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

/**
 * Hook to get motion config
 * @public
 */
export { useMotionConfig };
