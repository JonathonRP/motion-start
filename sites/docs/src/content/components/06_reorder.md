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

`Reorder.Group` owns one list. To drag a card from one list into another — a kanban board — pair it
with `layoutId`, which carries the card's identity across the two groups.

<DemoContainer class="py-8">
	<KanbanDemo />
</DemoContainer>

Two things make it work. The dragged card renders in whichever column it is currently _over_, rather
than the one it still belongs to, and the move is only committed on drop — an abandoned drag needs no
undo, because the preview just stops being true. And since that preview is state `Reorder` knows
nothing about, it is handed to `layoutDependency` so the group re-measures when it changes.

```svelte
<Reorder.Item
	value={card}
	layoutId={card.id}
	{layoutDependency}
	style={{ order: renderOrder(card) }}
	onDrag={(event, info) => previewDrop(card, info)}
	onDragEnd={() => commitDrop(card.id)}
/>
```

<Callout type="warning" title="Keep the item objects stable">

`Reorder.Group` keys its list by the item itself, so mutate items in place rather than mapping to
fresh objects. Replacing them changes every key at once and rebuilds the whole list mid-drag.
`$state` is deeply reactive, so assigning to a field is enough:

```ts
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
