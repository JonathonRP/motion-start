/**
 * Motion Context (Legacy compatibility layer)
 * This file provides backwards compatibility while using the new context system
 *
 * based on framer-motion@11.11.11,
 * Copyright (c) 2018 Framer B.V.
 */

import { createContext } from 'svelte';
import type { VisualElement } from '../../render/types.js';

/**
 * Motion context properties
 * @public
 */
export interface MotionContext<Instance = unknown> {
	visualElement?: VisualElement<Instance> | null;
	initial?: false | string | string[];
	animate?: string | string[];
}

const DEFAULT_MOTION: MotionContext = {};

/**
 * Motion context created with Svelte 5's createContext
 * @internal
 */
const [getMotionContext, setMotionContext] = createContext<MotionContext>();

/**
 * Motion context - provides visual element and animation state to descendants
 * @public
 */
export const MotionContext = {
	/**
	 * Set motion context value and return it
	 */
	set(value: MotionContext): MotionContext {
		return setMotionContext(value);
	},

	/**
	 * Get motion context value (returns default if not in context)
	 */
	get(): MotionContext {
		try {
			return getMotionContext();
		} catch {
			return DEFAULT_MOTION;
		}
	},
};

// Re-export from motion-context.svelte.ts for backwards compatibility
export {
	motionContext,
	useMotionContext,
	useVisualElement,
	type MotionContextValue,
} from '../motion-context.svelte.js';

// Type alias for backwards compatibility
export type { MotionContextValue as MotionContextProps } from '../motion-context.svelte.js';

// Re-export context as MOTION_CONTEXT_KEY for backwards compatibility
export { motionContext as MOTION_CONTEXT_KEY };

export { default as UseVisualElementContext } from './MotionContext.svelte';
