/**
 * Motion Config Context
 *
 * Provides global animation configuration to all motion attachments
 */

import { getContext, setContext } from 'svelte';
import type { TransitionOptions } from '../animation/types.js';

const MOTION_CONFIG_CONTEXT = Symbol('motion-config');

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
 * Set motion configuration context
 */
export function setMotionConfig(config: MotionConfigValue) {
	const merged = { ...defaultConfig, ...config };
	setContext(MOTION_CONFIG_CONTEXT, merged);
	return merged;
}

/**
 * Get motion configuration from context
 */
export function getMotionConfig(): MotionConfigValue {
	return getContext<MotionConfigValue>(MOTION_CONFIG_CONTEXT) ?? defaultConfig;
}

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
	const config = getMotionConfig();

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

	const config = getMotionConfig();
	return transition ?? config.transition ?? { type: 'spring', stiffness: 500, damping: 25 };
}
