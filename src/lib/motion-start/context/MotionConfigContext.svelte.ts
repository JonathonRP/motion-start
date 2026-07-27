/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { getContext, setContext } from 'svelte';
import type { TransformPoint } from '../projection/geometry/types.js';
import type { Transition } from '../types.js';

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
export interface MotionConfigContextType extends MotionConfigContext {
	readonly config: MotionConfigContext;
	setConfig: (config: Partial<MotionConfigContext>) => void;
	updateConfig: (fn: (config: MotionConfigContext) => MotionConfigContext) => void;
}

export const defaultMotionConfig: MotionConfigContext = Object.freeze({
	reducedMotion: 'never',
	transformPagePoint: (p: Parameters<TransformPoint>[0]) => p,
	isStatic: false,
});

/**
 * Create a reactive motion config context with $state runes.
 * Must be called within a component or .svelte.ts file.
 */
export function createMotionConfigContext(
	initialConfig: MotionConfigContext = defaultMotionConfig,
	getConfig?: () => MotionConfigContext
): MotionConfigContextType {
	let config = $state<MotionConfigContext>({ ...defaultMotionConfig, ...initialConfig });
	const readConfig = () => getConfig?.() ?? config;

	return {
		get config() {
			return readConfig();
		},
		get transformPagePoint() {
			return readConfig().transformPagePoint;
		},
		get isStatic() {
			return readConfig().isStatic;
		},
		get transition() {
			return readConfig().transition;
		},
		get reducedMotion() {
			return readConfig().reducedMotion;
		},
		get nonce() {
			return readConfig().nonce;
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

function createDefaultMotionConfigContext(): MotionConfigContextType {
	return {
		...defaultMotionConfig,
		config: defaultMotionConfig,
		setConfig: () => {},
		updateConfig: () => {},
	};
}

function useMotionConfigContext(): MotionConfigContextType {
	return getContext<MotionConfigContextType>(MOTION_CONFIG_CONTEXT_KEY) ?? createDefaultMotionConfigContext();
}

function setMotionConfigContext(context: MotionConfigContextType): MotionConfigContextType {
	return setContext(MOTION_CONFIG_CONTEXT_KEY, context);
}

export { useMotionConfigContext, setMotionConfigContext };
