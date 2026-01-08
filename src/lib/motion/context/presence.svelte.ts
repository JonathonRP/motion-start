/**
 * Presence Context
 *
 * Manages element lifecycle for exit animations
 * Uses Svelte 5's context system with $state for reactivity
 */

import { getContext, setContext, onMount } from 'svelte';
import { untrack } from 'svelte';

const PRESENCE_CONTEXT = Symbol('motion-presence');

export type PresenceContextValue = {
	/** Register a child that needs exit animation */
	register: (id: string, exit: () => Promise<void>) => void;
	/** Unregister a child */
	unregister: (id: string) => void;
	/** Check if presence is tracking exits */
	isPresent: boolean;
	/** Custom value passed to exit animations */
	custom?: any;
	/** Signal that initial mount is complete */
	initial: boolean;
};

/**
 * Create a presence context for managing exit animations
 */
export function createPresenceContext(options?: { custom?: any; initial?: boolean }) {
	const children = new Map<string, () => Promise<void>>();

	const context: PresenceContextValue = {
		register(id, exit) {
			children.set(id, exit);
		},
		unregister(id) {
			children.delete(id);
		},
		get isPresent() {
			return true;
		},
		custom: options?.custom,
		initial: options?.initial ?? true
	};

	setContext(PRESENCE_CONTEXT, context);

	return {
		/** Trigger exit animations for all children and wait */
		async exitAll() {
			const exits = Array.from(children.values());
			await Promise.all(exits.map((exit) => exit()));
		},
		/** Get number of registered children */
		get count() {
			return children.size;
		}
	};
}

/**
 * Get the presence context
 */
export function getPresenceContext(): PresenceContextValue | undefined {
	return getContext<PresenceContextValue>(PRESENCE_CONTEXT);
}

/**
 * Presence state for a single element
 */
export type PresenceState = {
	/** Whether the element is present in the tree */
	isPresent: boolean;
	/** Whether safe to remove (after exit animation) */
	safeToRemove: () => void;
	/** Custom value from parent */
	custom?: any;
};

/**
 * Hook to get presence state for exit animations
 */
export function usePresence(): PresenceState {
	const context = getPresenceContext();

	// If no context, element is always present
	if (!context) {
		return {
			isPresent: true,
			safeToRemove: () => {},
			custom: undefined
		};
	}

	let safeToRemoveCallback: (() => void) | null = null;

	return {
		get isPresent() {
			return context.isPresent;
		},
		safeToRemove() {
			safeToRemoveCallback?.();
		},
		get custom() {
			return context.custom;
		}
	};
}

/**
 * Generate a unique ID for presence tracking
 */
let presenceIdCounter = 0;
export function generatePresenceId(): string {
	return `presence-${++presenceIdCounter}`;
}
