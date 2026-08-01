---
title: Reorder
description: Drag-to-reorder lists with layout animations built in.
section: Components
---

<script>
	import { Callout, DemoContainer } from "@svecodocs/kit";
	import ReorderDemo from "$lib/components/demos/reorder-demo.svelte";
	import KanbanDemo from "$lib/components/demos/kanban-demo.svelte";
</script>

`Reorder.Group` and `Reorder.Item` turn any list into a drag-to-reorder list. Items are draggable,
animate to their new positions, and the group reports the new order.

<DemoContainer class="flex justify-center py-8">
	<ReorderDemo />
</DemoContainer>

```svelte
<script>
	import { Reorder } from "motion-start";

	let items = $state(["spring", "tween", "inertia", "keyframes"]);
</script>

<Reorder.Group values={items} onReorder={(next) => (items = next)}>
	{#snippet children({ item })}
		<Reorder.Item value={item}>
			{item}
		</Reorder.Item>
	{/snippet}
</Reorder.Group>
```

## Reorder.Group

| Prop         | Type                        | Description                                                        |
| ------------ | --------------------------- | ------------------------------------------------------------------ |
| `values`     | `T[]`                       | The array being reordered. Required.                               |
| `onReorder`  | `(newOrder: T[]) => void`   | Called with the new order as items are dragged. Required.          |
| `axis`       | `"x" \| "y"`                 | Drag axis. Defaults to `"y"`.                                      |
| `as`         | `string`                    | Element to render. Defaults to `"ul"`.                             |

The group renders its children through a snippet that receives each item, so the list stays keyed by
value.

## Reorder.Item

| Prop    | Type     | Description                                                    |
| ------- | -------- | -------------------------------------------------------------- |
| `value` | `T`      | The item's entry in `values`. Required.                        |
| `as`    | `string` | Element to render. Defaults to `"li"`.                         |

`Reorder.Item` is a motion component, so `whileDrag`, `transition` and the other animation props all
work.

```svelte
<Reorder.Item value={item} whileDrag={{ scale: 1.04 }} transition={{ type: "spring" }}>
	{item}
</Reorder.Item>
```

<Callout type="tip" title="Drag handles">

Set `dragListener={false}` on the item and start the drag from a handle with `useDragControls` when
the whole row shouldn't be draggable.

</Callout>

## Moving between lists

Each column is a `Reorder.Group`, which owns the order inside that list. Add the same `layoutId` to
each `Reorder.Item` and it can also be re-parented between groups: `Reorder` handles the source
column while `layoutId` carries the card's identity across the handoff.

<DemoContainer class="py-8">
	<KanbanDemo />
</DemoContainer>

Give every group the same stable `cards` array, then conditionally render each card in its committed
or preview column. Cards reorder while they remain in their source column. Once the pointer crosses
into another column, `layoutId` hands the active drag to that group's copy and opens its target slot;
release commits the preview.

```svelte
<Reorder.Group
	values={cards}
	onReorder={(next) => {
		if (previewColumn) return;
		reindex(next);
	}}
>
	{#snippet children({ item: card })}
		{#if renderColumn(card) === column}
			<Reorder.Item
				value={card}
				layoutId={card.id}
				drag
				dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
				dragElastic={1}
				onDrag={(event, info) => previewDrop(card, info)}
				onDragEnd={(event, info) => commitDrop(card, info)}
				whileDrag={{ scale: 1.04, rotate: -1.5, zIndex: 10 }}
			>
				{card.title}
			</Reorder.Item>
		{/if}
	{/snippet}
</Reorder.Group>
```

<Callout type="warning" title="Mutate the cards in place">

`Reorder.Group` keys each item by its value. If that value is an object, replacing cards with fresh
objects during `onReorder` unmounts the active item mid-gesture; it also breaks the stable identity
that `layoutId` needs for the handoff. `$state` is deeply reactive, so mutate the existing cards:

```ts
card.column = target;
ordered.forEach((card, index) => {
	card.order = index;
});
```

</Callout>

<Callout type="tip" title="Keyboard">

Dragging is a pointer gesture, so bind the arrow keys to the same move — try it on the board above.
Note that `info.point` in a drag handler is in _page_ coordinates, so subtract the scroll offset
before comparing it against `getBoundingClientRect()`.

</Callout>
