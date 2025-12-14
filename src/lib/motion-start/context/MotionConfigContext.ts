/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { createContext } from 'svelte';
import type { TransformPoint } from '../projection/geometry/types';
import type { Transition } from '../types';

export type ReducedMotionConfig = 'always' | 'never' | 'user';

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

/**
 * Reactive motion config context using Svelte 5 runes
 */
export interface MotionConfigContextType {
	config: MotionConfigContext;
	setConfig: (config: Partial<MotionConfigContext>) => void;
	updateConfig: (fn: (config: MotionConfigContext) => MotionConfigContext) => void;
}

export const defaultMotionConfig: MotionConfigContext = {
	reducedMotion: 'never',
	transformPagePoint: (p) => p,
	isStatic: false,
};

/**
 * Create a reactive motion config context with $state runes.
 * Must be called within a component or .svelte.ts file.
 */
export function createMotionConfigContext(
	initialConfig: MotionConfigContext = defaultMotionConfig
): MotionConfigContextType {
	let config = $state<MotionConfigContext>(initialConfig);

	return {
		get config() {
			return config;
		},

		setConfig: (newConfig: Partial<MotionConfigContext>) => {
			config = { ...config, ...newConfig };
		},

		updateConfig: (fn: (config: MotionConfigContext) => MotionConfigContext) => {
			config = fn(config);
		},
	};
}

// Context key
export const MOTION_CONFIG_CONTEXT_KEY = Symbol('MotionConfigContext');

/**
 * @public
 */
const [getMotionConfigContext, setMotionConfigContext] = createContext<MotionConfigContext>();

function useMotionConfig() {
	try {
		return getMotionConfigContext();
	} catch {
		return setMotionConfigContext(defaultMotionConfig);
	}
}

export { useMotionConfig, setMotionConfigContext };