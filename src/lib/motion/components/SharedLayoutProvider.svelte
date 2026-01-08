<script lang="ts">
	/**
	 * SharedLayoutProvider Component
	 *
	 * Enables shared element transitions between components
	 *
	 * @example
	 * ```svelte
	 * <SharedLayoutProvider>
	 *   {#if showList}
	 *     <ListItem layoutId="hero" />
	 *   {:else}
	 *     <DetailView layoutId="hero" />
	 *   {/if}
	 * </SharedLayoutProvider>
	 * ```
	 */

	import type { Snippet } from 'svelte';
	import type { TransitionOptions } from '../animation/types.js';
	import { createSharedLayoutContext } from '../context/shared-layout.svelte.js';

	type Props = {
		/** Transition for shared layout animations */
		transition?: TransitionOptions;
		/** Children */
		children: Snippet;
	};

	let { transition, children }: Props = $props();

	// Create shared layout context
	createSharedLayoutContext({ transition });
</script>

{@render children()}
