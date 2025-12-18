/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { createContext } from 'svelte';
import type { VariantLabels } from '../motion/types';
import type { MutableRefObject } from '../utils/safe-react-types';

/**
 * @public
 */
export interface PresenceContext {
	id: number | string;
	isPresent: boolean;
	register: (id: string | number) => () => void;
	onExitComplete?: (id: string | number) => void;
	initial?: false | VariantLabels;
	custom?: any;
}

/**
 * Reactive presence context using Svelte 5 runes.
 * Tracks which children are visible and manages exit animations.
 */
export interface PresenceContextType {
	// Reactive state (direct access, automatically reactive in $effect)
	visibleChildren: string[];
	isExiting: boolean;

	// Methods
	addChild: (id: string) => void;
	removeChild: (id: string) => void;
	registerExitAnimation: (id: string, animation: Promise<void>) => void;
	waitForExitAnimations: () => Promise<void>;
}

/**
 * Create a reactive presence context with $state runes.
 * Must be called within a component or .svelte.ts file with runes enabled.
 */
export function createPresenceContext(): PresenceContextType {
	let visibleChildren = $state<string[]>([]);
	let isExiting = $state<boolean>(false);
	const exitAnimations = new Map<string, Promise<void>>();

	return {
		get visibleChildren() {
			return visibleChildren;
		},
		set visibleChildren(value: string[]) {
			visibleChildren = value;
		},

		get isExiting() {
			return isExiting;
		},
		set isExiting(value: boolean) {
			isExiting = value;
		},

		addChild: (id: string) => {
			visibleChildren = [...visibleChildren, id];
		},

		removeChild: (id: string) => {
			visibleChildren = visibleChildren.filter((c) => c !== id);
		},

		registerExitAnimation: (id: string, animation: Promise<void>) => {
			exitAnimations.set(id, animation);
			isExiting = exitAnimations.size > 0;
		},

		waitForExitAnimations: async () => {
			const animations = Array.from(exitAnimations.values());
			await Promise.all(animations);
			exitAnimations.clear();
			isExiting = false;
		},
	};
}

// Context key for getContext/setContext
export const PRESENCE_CONTEXT_KEY = Symbol('PresenceContext');

/**
 * @public
 */
const [getPresenceContext, setPresenceContext] = createContext<MutableRefObject<PresenceContext | null>>();

function usePresenceContext() {
	try {
		return getPresenceContext();
	} catch {
		return setPresenceContext({ current: null });
	}
}

export { usePresenceContext, setPresenceContext };
