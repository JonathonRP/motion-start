<script lang="ts">
/**
 * Regression fixture for the docs kanban board's core requirement: an
 * actively dragged Reorder.Item/layoutId card is conditionally reparented to
 * a *different* Reorder.Group (and therefore a different DOM parent) while
 * the pointer gesture that started the drag is still in progress - not on
 * drop. The newly mounted, same-`layoutId` copy must immediately keep
 * following subsequent pointermoves, and the whole gesture must still end in
 * exactly one `onDragEnd` call.
 *
 * Every list is handed the same full, stable `items` array (mirroring the
 * docs kanban architecture contract) and gates which list actually renders a
 * given item with a plain `{#if}`, rather than filtering `values` per list.
 */
import { MotionConfig, Reorder } from 'motion-start';
import type { Attachment } from 'svelte/attachments';

type ListId = 'list-a' | 'list-b';
type Item = { id: string; label: string; list: ListId; order: number };

const LISTS: ListId[] = ['list-a', 'list-b'];
const PAGE_POINT_OFFSET = 100;

let items = $state<Item[]>([
	{ id: 'alpha', label: 'Alpha', list: 'list-a', order: 0 },
	{ id: 'beta', label: 'Beta', list: 'list-a', order: 1 },
	{ id: 'gamma', label: 'Gamma', list: 'list-b', order: 0 },
]);

let listRefs = $state<Record<ListId, HTMLElement | null>>({
	'list-a': null,
	'list-b': null,
});

// Counters/positions are read by Cypress via data-testid nodes below. They
// live on this never-unmounted fixture component, not on the individual
// Reorder.Item instances, so they survive the item being reparented.
let dragCount = $state(0);
let dragEndCount = $state(0);
let lastPointerX = $state(0);
let lastPointerY = $state(0);

function captureList(list: ListId): Attachment<HTMLElement> {
	return (element) => {
		listRefs[list] = element;
		return () => {
			if (listRefs[list] === element) listRefs[list] = null;
		};
	};
}

function inList(list: ListId) {
	return items.filter((item) => item.list === list).sort((a, b) => a.order - b.order);
}

function listAt(x: number, y: number): ListId | null {
	for (const list of LISTS) {
		const element = listRefs[list];
		if (!element) continue;
		const box = element.getBoundingClientRect();
		if (x >= box.left && x <= box.right && y >= box.top && y <= box.bottom) return list;
	}
	return null;
}

function transformPagePoint(point: { x: number; y: number }) {
	return {
		x: point.x + PAGE_POINT_OFFSET,
		y: point.y + PAGE_POINT_OFFSET,
	};
}

function reindex(list: ListId, ordered: Item[]) {
	ordered.forEach((entry, index) => {
		if (entry.list === list) entry.order = index;
	});
}

function handleDrag(item: Item, info: { point: { x: number; y: number } }) {
	dragCount++;
	lastPointerX = info.point.x;
	lastPointerY = info.point.y;

	const target = listAt(
		info.point.x - PAGE_POINT_OFFSET - window.scrollX,
		info.point.y - PAGE_POINT_OFFSET - window.scrollY
	);
	if (target && target !== item.list) {
		// Conditionally reparent the active card into the other Reorder.Group's
		// DOM subtree *during* the same pointer gesture, not on drop.
		item.list = target;
		item.order = inList(target).length;
	}
}

function handleDragEnd() {
	dragEndCount++;
}
</script>

<MotionConfig {transformPagePoint}>
	<div style="display: flex; gap: 2rem; padding: 2rem;">
		{#each LISTS as list (list)}
			<div
				data-testid={`list-${list}`}
				style="min-height: 220px; width: 220px; border: 1px solid #888; padding: 10px;"
				{@attach captureList(list)}
			>
				<Reorder.Group values={items} onReorder={(next) => reindex(list, next as Item[])}>
					{#snippet children({ item })}
						{#if (item as Item).list === list}
							<Reorder.Item
								id={`multi-item-${(item as Item).id}`}
								value={item}
								layoutId={(item as Item).id}
								drag={true}
								dragElastic={1}
								onDrag={(_event, info) =>
									handleDrag(item as Item, info as { point: { x: number; y: number } })}
								onDragEnd={handleDragEnd}
							>
								{(item as Item).label}
							</Reorder.Item>
						{/if}
					{/snippet}
				</Reorder.Group>
			</div>
		{/each}
	</div>

	<div data-testid="drag-count">{dragCount}</div>
	<div data-testid="dragend-count">{dragEndCount}</div>
	<div data-testid="last-pointer">{lastPointerX},{lastPointerY}</div>
</MotionConfig>
