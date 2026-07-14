/**
 * Configuration for Svelte-native presence coordination.
 *
 * Child identity and lifetime are expressed with keyed `{#each}` and `{#if}`
 * blocks. AnimatePresence supplies exit configuration; motion elements bridge
 * their block outro into the normal Motion feature lifecycle.
 */
export interface AnimatePresenceProps {
	/** Disable initial animations for motion children present on first render. */
	initial?: boolean;

	/** Latest data supplied to dynamic exit variants. */
	custom?: unknown;

	/** Called after all motion elements in the current Svelte outro batch finish. */
	onExitComplete?: () => void;

	/**
	 * `popLayout` removes exiting elements from layout while preserving their
	 * measured visual position. `sync` uses Svelte's normal outro layout.
	 * `wait` is retained for API compatibility and follows Svelte block ordering.
	 */
	mode?: 'sync' | 'popLayout' | 'wait';

	/** Whether presence changes should participate in layout projection. */
	presenceAffectsLayout?: boolean;
}
