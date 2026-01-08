<script lang="ts" module>
	/**
	 * Reorder Components
	 *
	 * Drag-to-reorder functionality with smooth animations
	 */

	export type ReorderContextValue = {
		/** Register a reorderable item */
		registerItem: (id: string, element: HTMLElement) => void;
		/** Unregister an item */
		unregisterItem: (id: string) => void;
		/** Update item position during drag */
		updatePosition: (id: string, y: number) => void;
		/** Complete reorder */
		completeReorder: () => void;
		/** Axis of reorder */
		axis: 'x' | 'y';
	};
</script>

<script lang="ts">
	import { setContext, getContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { TransitionOptions } from '../animation/types.js';
	import { layoutGroup } from '../attachments/layout.svelte.js';

	const REORDER_CONTEXT = Symbol('reorder');

	type Props<T> = {
		/** Array of items to reorder */
		values: T[];
		/** Callback when order changes */
		onReorder: (newValues: T[]) => void;
		/** Axis of reorder */
		axis?: 'x' | 'y';
		/** Transition for reorder animations */
		transition?: TransitionOptions;
		/** Children - receives each item and index */
		children: Snippet<[{ item: T; index: number }]>;
	};

	let { values, onReorder, axis = 'y', transition, children }: Props<any> = $props();

	// Track items and their positions
	const items = new Map<string, { element: HTMLElement; index: number }>();
	let draggedId: string | null = null;
	let dragStartIndex = -1;

	function getItemAtPosition(pos: number): string | null {
		for (const [id, item] of items) {
			if (id === draggedId) continue;

			const rect = item.element.getBoundingClientRect();
			const center = axis === 'y' ? rect.top + rect.height / 2 : rect.left + rect.width / 2;

			if (pos < center) {
				return id;
			}
		}
		return null;
	}

	const context: ReorderContextValue = {
		registerItem(id, element) {
			const index = values.findIndex((v: any) => String(v.id ?? v) === id);
			items.set(id, { element, index });
		},

		unregisterItem(id) {
			items.delete(id);
		},

		updatePosition(id, pos) {
			if (draggedId !== id) {
				draggedId = id;
				dragStartIndex = items.get(id)?.index ?? -1;
			}

			// Find insertion point
			const targetId = getItemAtPosition(pos);

			if (targetId && targetId !== id) {
				// Reorder the array
				const currentIndex = values.findIndex((v: any) => String(v.id ?? v) === id);
				const targetIndex = values.findIndex((v: any) => String(v.id ?? v) === targetId);

				if (currentIndex !== -1 && targetIndex !== -1 && currentIndex !== targetIndex) {
					const newValues = [...values];
					const [removed] = newValues.splice(currentIndex, 1);
					newValues.splice(targetIndex, 0, removed);
					onReorder(newValues);
				}
			}
		},

		completeReorder() {
			draggedId = null;
			dragStartIndex = -1;
		},

		axis
	};

	setContext(REORDER_CONTEXT, context);

	export function getReorderContext(): ReorderContextValue | undefined {
		return getContext<ReorderContextValue>(REORDER_CONTEXT);
	}
</script>

<div class="reorder-group" role="list" style="display: contents;">
	{#each values as item, index (item.id ?? item)}
		{@render children({ item, index })}
	{/each}
</div>
