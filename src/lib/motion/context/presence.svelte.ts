/**
 * Presence Context
 *
 * Manages element lifecycle for exit animations
 * Uses Svelte 5's type-safe createContext API
 */

import { createContext } from 'svelte';

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
 * Type-safe context for presence/exit animations
 */
export const [getPresenceContext, setPresenceContext] = createContext<PresenceContextValue>();

/**
 * Create a presence context for managing exit animations
 */
export function createPresenceState(options?: { custom?: any; initial?: boolean }) {
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

	// Set the context
	setPresenceContext(context);

	return {
		/** Trigger exit animations for all children and wait */
		async exitAll() {
			const exits = Array.from(children.values());
			await Promise.all(exits.map((exit) => exit()));
		},
		/** Get number of registered children */
		get count() {
			return children.size;
		},
		/** The context value (for manual access) */
		context
	};
}

/**
 * Safely get presence context (returns undefined if not in context)
 */
export function usePresenceContext(): PresenceContextValue | undefined {
	try {
		return getPresenceContext();
	} catch {
		return undefined;
	}
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
	const context = usePresenceContext();

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
