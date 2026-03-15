/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { createContext } from 'svelte';
import type { NodeGroup } from '../projection/node/group';

export interface LayoutGroupContext {
	id?: string;
	group?: NodeGroup;
	forceRender?: VoidFunction;
	key?: number;
}

/**
 * Reactive layout group context using Svelte 5 runes
 */
export interface LayoutGroupContextType {
	// Reactive state (direct access)
	dimensions: Map<string, DOMRect>;
	isAnimating: boolean;
	layoutChanged: boolean;

	// Methods
	registerElement: (id: string, rect: DOMRect) => void;
	unregisterElement: (id: string) => void;
	startAnimation: () => void;
	finishAnimation: () => void;
}

/**
 * Create a reactive layout group context with $state and $derived runes.
 * Must be called within a component or .svelte.ts file.
 */
export function createLayoutGroupContext(): LayoutGroupContextType {
	let dimensions = $state<Map<string, DOMRect>>(new Map());
	let animationCount = $state<number>(0);

	// Derived state
	let isAnimating = $derived(animationCount > 0);
	let layoutChanged = $derived(dimensions.size > 0);

	return {
		get dimensions() {
			return dimensions;
		},
		get isAnimating() {
			return isAnimating;
		},
		get layoutChanged() {
			return layoutChanged;
		},

		registerElement: (id: string, rect: DOMRect) => {
			// Create new Map to trigger reactivity
			dimensions = new Map(dimensions).set(id, rect);
		},

		unregisterElement: (id: string) => {
			const newDimensions = new Map(dimensions);
			newDimensions.delete(id);
			dimensions = newDimensions;
		},

		startAnimation: () => {
			animationCount++;
		},

		finishAnimation: () => {
			animationCount = Math.max(0, animationCount - 1);
		},
	};
}

// Context key
export const LAYOUT_GROUP_CONTEXT_KEY = Symbol('LayoutGroupContext');

const [getLayoutGroupContext, setLayoutGroupContext] = createContext<LayoutGroupContext | null>();

function useLayoutGroupContext() {
	try {
		return getLayoutGroupContext();
	} catch {
		return null;
	}
}

export { useLayoutGroupContext, setLayoutGroupContext };
