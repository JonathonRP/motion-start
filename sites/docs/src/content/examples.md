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

`Reorder.Group` owns one list. Dragging a card from one list into another is a different problem: the
card has to be picked up in one group and dropped into another without either group losing track of
it.

Drag a card anywhere on the board, or focus one and use the arrow keys.

<DemoContainer class="py-8">
	<KanbanDemo />
</DemoContainer>

```svelte
<LayoutGroup>
	{#each columns as column (column)}
		<Reorder.Group values={cards} onReorder={(next) => reindex(next)}>
			{#snippet children({ item: card })}
				{#if rendersIn(card, column)}
					<Reorder.Item
						value={card}
						layoutId={card.id}
						{layoutDependency}
						style={{ order: renderOrder(card) }}
						onDrag={(event, info) => previewDrop(card, info)}
						onDragEnd={() => commitDrop(card.id)}
					>
						{card.title}
					</Reorder.Item>
				{/if}
			{/snippet}
		</Reorder.Group>
	{/each}
</LayoutGroup>
```

The dragged card renders in whichever column it is currently _over_ rather than the one it still
belongs to, and the move is only committed on drop — so an abandoned drag needs no undo, because the
preview simply stops being true. `layoutId` carries the card's identity across the two groups, and
because the preview is state `Reorder` knows nothing about, it is passed to `layoutDependency`.

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
