<script lang="ts">
	/**
	 * ReorderItem Component
	 *
	 * A draggable item within a Reorder group
	 *
	 * @example
	 * ```svelte
	 * <Reorder values={items} onReorder={(v) => items = v}>
	 *   {#snippet children({ item })}
	 *     <ReorderItem value={item}>
	 *       {item.label}
	 *     </ReorderItem>
	 *   {/snippet}
	 * </Reorder>
	 * ```
	 */

	import { onMount, getContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { ReorderContextValue } from './Reorder.svelte';
	import { layout } from '../attachments/layout.svelte.js';

	type Props = {
		/** The value this item represents (used for identification) */
		value: any;
		/** Custom element tag */
		as?: string;
		/** Children */
		children: Snippet;
	};

	let { value, as = 'div', children }: Props = $props();

	const REORDER_CONTEXT = Symbol.for('reorder');
	const context = getContext<ReorderContextValue>(REORDER_CONTEXT);

	let element: HTMLElement;
	let isDragging = $state(false);
	let startY = 0;
	let startX = 0;
	let currentOffset = { x: 0, y: 0 };

	const id = String(value.id ?? value);

	onMount(() => {
		if (context) {
			context.registerItem(id, element);
		}

		return () => {
			if (context) {
				context.unregisterItem(id);
			}
		};
	});

	function handlePointerDown(e: PointerEvent) {
		isDragging = true;
		startY = e.clientY;
		startX = e.clientX;
		currentOffset = { x: 0, y: 0 };

		element.setPointerCapture(e.pointerId);
		element.style.zIndex = '1000';
		element.style.cursor = 'grabbing';
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDragging || !context) return;

		const axis = context.axis;
		if (axis === 'y') {
			currentOffset.y = e.clientY - startY;
			element.style.transform = `translateY(${currentOffset.y}px)`;
			context.updatePosition(id, e.clientY);
		} else {
			currentOffset.x = e.clientX - startX;
			element.style.transform = `translateX(${currentOffset.x}px)`;
			context.updatePosition(id, e.clientX);
		}
	}

	function handlePointerUp(e: PointerEvent) {
		if (!isDragging) return;

		isDragging = false;
		element.releasePointerCapture(e.pointerId);
		element.style.zIndex = '';
		element.style.cursor = '';
		element.style.transform = '';

		if (context) {
			context.completeReorder();
		}
	}
</script>

<svelte:element
	this={as}
	bind:this={element}
	role="listitem"
	style="cursor: grab; touch-action: none; user-select: none;"
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	onpointercancel={handlePointerUp}
	use:layout
>
	{@render children()}
</svelte:element>
