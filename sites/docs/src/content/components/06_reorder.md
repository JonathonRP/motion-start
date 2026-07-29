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

`Reorder.Group` owns one list. Dragging a card from one list into another — a kanban board — is a
different job, and `Reorder` is the wrong tool for it: use a plain `motion.div` with `layoutId`,
which carries the card's identity across the two columns.

<DemoContainer class="py-8">
	<KanbanDemo />
</DemoContainer>

The card is dragged freely and the move is committed on release, so an abandoned drag needs no undo.
`dragConstraints` pinned to zero with `dragElastic={1}` lets the card follow the pointer anywhere
while still springing home if it is dropped somewhere that isn't a column. When the card is
re-parented, the two columns agree — via `layoutId` — that they are holding the same card, so it
animates from where you let go into its new slot.

```svelte
<motion.div
	layout
	layoutId={card.id}
	drag
	dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
	dragElastic={1}
	onDrag={(event, info) => (hovered = columnAt(info.point))}
	onDragEnd={(event, info) => commitDrop(card, info)}
	whileDrag={{ scale: 1.04, rotate: -1.5, zIndex: 10 }}
>
	{card.title}
</motion.div>
```

<Callout type="warning" title="Mutate the cards in place">

`layoutId` is keyed off the card's id but the `{#each}` is keyed off the object, so replacing cards
with fresh objects on every move tears the whole list down at once and leaves nothing to animate
from. `$state` is deeply reactive, so assigning to a field is enough:

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
