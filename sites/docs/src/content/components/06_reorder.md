---
title: Reorder
description: Drag-to-reorder lists with layout animations built in.
section: Components
---

<script>
	import { Callout, DemoContainer } from "@svecodocs/kit";
	import ReorderDemo from "$lib/components/demos/reorder-demo.svelte";
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
