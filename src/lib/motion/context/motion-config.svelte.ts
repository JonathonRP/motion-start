/**
 * Motion Config Context
 *
 * Provides global animation configuration to all motion attachments
 * Uses Svelte 5's type-safe createContext API
 */

import { createContext } from 'svelte';
import type { TransitionOptions } from '../animation/types.js';

export type MotionConfigValue = {
	/** Default transition for all animations */
	transition?: TransitionOptions;
	/** Reduce motion for accessibility */
	reducedMotion?: 'user' | 'always' | 'never';
	/** Transform page point for nested scroll containers */
	transformPagePoint?: (point: { x: number; y: number }) => { x: number; y: number };
	/** Whether this is the initial render (skip initial animations) */
	isStatic?: boolean;
};

const defaultConfig: MotionConfigValue = {
	reducedMotion: 'user',
	isStatic: false
};

/**
 * Type-safe context for motion configuration
 * Returns [get, set] tuple
 */
export const [getMotionConfig, setMotionConfig] = createContext<MotionConfigValue>(defaultConfig);

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
	let config: MotionConfigValue;
	try {
		config = getMotionConfig();
	} catch {
		config = defaultConfig;
	}

	if (config.reducedMotion === 'always') return true;
	if (config.reducedMotion === 'never') return false;

	// Check user preference
	if (typeof window !== 'undefined') {
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	return false;
}

/**
 * Get the effective transition based on reduced motion preference
 */
export function getEffectiveTransition(transition?: TransitionOptions): TransitionOptions {
	if (prefersReducedMotion()) {
		return { duration: 0 };
	}

	let config: MotionConfigValue;
	try {
		config = getMotionConfig();
	} catch {
		config = defaultConfig;
	}

	return transition ?? config.transition ?? { type: 'spring', stiffness: 500, damping: 25 };
}
