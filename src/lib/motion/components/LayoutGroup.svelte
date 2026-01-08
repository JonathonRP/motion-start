<script lang="ts">
	/**
	 * LayoutGroup Component
	 *
	 * Modern replacement for deprecated AnimateSharedLayout
	 *
	 * LayoutGroup serves two purposes:
	 * 1. Namespace layoutId - allows building reusable components that use
	 *    shared layout animations without conflicts
	 * 2. Group sibling components that perform distinct layout animations
	 *    that may affect each other's layout
	 *
	 * @example
	 * ```svelte
	 * <!-- Namespacing for reusable components -->
	 * <LayoutGroup id="tabs-1">
	 *   <TabBar items={items1} />
	 * </LayoutGroup>
	 *
	 * <LayoutGroup id="tabs-2">
	 *   <TabBar items={items2} />
	 * </LayoutGroup>
	 *
	 * <!-- Grouping siblings -->
	 * <LayoutGroup>
	 *   <Sidebar />
	 *   <MainContent />
	 * </LayoutGroup>
	 * ```
	 */

	import type { Snippet } from 'svelte';
	import type { TransitionOptions } from '../animation/types.js';
	import { createLayoutGroupState } from '../context/layout-group.svelte.js';

	type Props = {
		/** Unique ID to namespace layoutIds within this group */
		id?: string;
		/** Default transition for layout animations in this group */
		transition?: TransitionOptions;
		/** Children */
		children: Snippet;
	};

	let { id, transition, children }: Props = $props();

	// Create the layout group state and context
	createLayoutGroupState({ id, transition });
</script>

{@render children()}
