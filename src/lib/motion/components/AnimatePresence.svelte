<script lang="ts">
	/**
	 * AnimatePresence Component
	 *
	 * Manages exit animations for children being removed from the tree
	 *
	 * @example
	 * ```svelte
	 * <AnimatePresence>
	 *   {#if show}
	 *     <div
	 *       {@attach motion({
	 *         initial: { opacity: 0 },
	 *         animate: { opacity: 1 },
	 *         exit: { opacity: 0 }
	 *       })}
	 *     >
	 *       Animated content
	 *     </div>
	 *   {/if}
	 * </AnimatePresence>
	 * ```
	 */

	import type { Snippet } from 'svelte';
	import { createPresenceState } from '../context/presence.svelte.js';

	type Props = {
		/** Only render one child at a time (wait for exit before enter) */
		mode?: 'sync' | 'wait' | 'popLayout';
		/** Skip initial animations on mount */
		initial?: boolean;
		/** Custom data passed to exit animations */
		custom?: any;
		/** Callback when all exit animations complete */
		onExitComplete?: () => void;
		/** Children */
		children: Snippet;
	};

	let { mode = 'sync', initial = true, custom, onExitComplete, children }: Props = $props();

	// Track exiting children
	let exitingChildren = $state<Map<string, HTMLElement>>(new Map());
	let isInitialRender = $state(true);

	// Create presence state and context
	const presence = createPresenceState({
		custom,
		initial: initial && !isInitialRender
	});

	// Mark initial render complete after mount
	$effect(() => {
		isInitialRender = false;
	});

	// Handle exit complete
	$effect(() => {
		if (exitingChildren.size === 0) {
			onExitComplete?.();
		}
	});
</script>

{@render children()}

<!-- Render exiting children in a portal-like fashion -->
{#each [...exitingChildren.entries()] as [key, element]}
	<!-- Exiting elements are managed by the presence system -->
{/each}
