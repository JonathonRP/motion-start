---
title: Examples
description: A gallery of everything Motion Start can do, in one scroll.
section: Getting Started
---

<script>
	import { Callout, DemoContainer } from "@svecodocs/kit";
	import TransitionDemo from "$lib/components/demos/transition-demo.svelte";
	import StaggerDemo from "$lib/components/demos/stagger-demo.svelte";
	import GestureDemo from "$lib/components/demos/gesture-demo.svelte";
	import DragDemo from "$lib/components/demos/drag-demo.svelte";
	import LayoutDemo from "$lib/components/demos/layout-demo.svelte";
	import SharedLayoutDemo from "$lib/components/demos/shared-layout-demo.svelte";
	import PresenceDemo from "$lib/components/demos/presence-demo.svelte";
	import ReorderDemo from "$lib/components/demos/reorder-demo.svelte";
	import KanbanDemo from "$lib/components/demos/kanban-demo.svelte";
	import MotionValueDemo from "$lib/components/demos/motion-value-demo.svelte";
</script>

Every demo below is live — the same components used throughout the rest of these docs, collected
in one place. Each links to the page that explains it.

## Transitions

Springs are the default for transforms. Everything else eases.

<DemoContainer class="flex justify-center py-10">
	<TransitionDemo />
</DemoContainer>

```svelte
<motion.div animate={{ x: 100 }} transition={{ type: "spring", stiffness: 300 }} />
```

Read more in [Transitions](/docs/animation/transitions).

## Variants and stagger

Variants let a parent orchestrate its children, so a list can cascade without any per-item timing.

<DemoContainer class="py-10">
	<StaggerDemo />
</DemoContainer>

```svelte
<motion.ul variants={container} initial="hidden" animate="visible">
	{#each items as item (item)}
		<motion.li variants={child} />
	{/each}
</motion.ul>
```

Read more in [Animation overview](/docs/animation/overview).

## Gestures

`whileHover` and `whileTap` are transient states — release the gesture and the element returns to
whatever `animate` says, with no bookkeeping.

<DemoContainer class="flex justify-center py-10">
	<GestureDemo />
</DemoContainer>

```svelte
<motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }} />
```

## Drag

<DemoContainer class="flex justify-center py-10">
	<DragDemo />
</DemoContainer>

```svelte
<motion.div drag dragConstraints={{ left: -80, right: 80 }} dragElastic={0.2} />
```

Read more in [Gestures](/docs/animation/gestures).

## Layout animations

`layout` measures the element before and after a change and animates the difference with
transforms, so you can animate properties that are otherwise far too expensive.

<DemoContainer class="py-8">
	<LayoutDemo />
</DemoContainer>

```svelte
<motion.div layout />
```

## Shared layout

A `layoutId` moves a single element between positions — the classic animated tab indicator.

<DemoContainer class="flex justify-center py-10">
	<SharedLayoutDemo />
</DemoContainer>

```svelte
<motion.span layoutId="tab-pill" />
```

Read more in [Layout animations](/docs/animation/layout).

## Exit animations

`AnimatePresence` keeps an element in the DOM long enough to animate out.

<DemoContainer class="flex justify-center py-10">
	<PresenceDemo />
</DemoContainer>

```svelte
<AnimatePresence>
	{#if visible}
		<motion.div exit={{ opacity: 0, scale: 0.9 }} />
	{/if}
</AnimatePresence>
```

Read more in [AnimatePresence](/docs/components/animate-presence).

## Reorder

<DemoContainer class="py-8">
	<ReorderDemo />
</DemoContainer>

```svelte
<Reorder.Group axis="y" bind:values={items}>
	{#each items as item (item)}
		<Reorder.Item value={item} />
	{/each}
</Reorder.Group>
```

Read more in [Reorder](/docs/components/reorder).

## Kanban board

Each column is a `Reorder.Group`, so cards shuffle smoothly within that list. Giving every
`Reorder.Item` a `layoutId` adds the other half of a kanban board: the same card can be re-parented
into another group without either column losing track of it.

Drag a card anywhere on the board, or focus one and use the arrow keys.

<DemoContainer class="py-8">
	<KanbanDemo />
</DemoContainer>

```svelte
<LayoutGroup>
	{#each columns as column (column)}
		<Reorder.Group
			as="div"
			values={inColumn(column)}
			onReorder={(next) => reindex(next)}
		>
			{#snippet children({ item: card })}
				<Reorder.Item
					as="div"
					value={card}
					layoutId={card.id}
					drag
					dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
					dragElastic={1}
					onDrag={(event, info) => (hovered = columnAt(info.point))}
					onDragEnd={(event, info) => commitDrop(card, info)}
					whileDrag={{ scale: 1.04, rotate: -1.5, zIndex: 10 }}
				>
					{card.title}
				</Reorder.Item>
			{/snippet}
		</Reorder.Group>
	{/each}
</LayoutGroup>
```

`Reorder` commits moves inside the source column while the card is dragged. `dragConstraints` pinned
to zero with `dragElastic={1}` lets the same item travel freely across the board; a cross-column move
is committed on release, and `layoutId` animates the re-parented item from the drop point into its
new slot.

Read more in [Reorder](/docs/components/reorder).

## Motion values

A motion value updates outside the component lifecycle, so you can drive an animation every frame
without re-rendering.

<DemoContainer class="py-10">
	<MotionValueDemo />
</DemoContainer>

```svelte
const x = useMotionValue(0);
const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);
```

Read more in [Motion values](/docs/motion-values/overview).

<Callout type="tip">
Every demo on this page is a plain Svelte component in
<code>src/lib/components/demos</code> — copy one and start editing.
</Callout>
