---
title: Layout animations
description: Animate between any two layouts, even between different elements.
section: Animation
---

<script>
	import { Callout, DemoContainer } from "@svecodocs/kit";
	import LayoutDemo from "$lib/components/demos/layout-demo.svelte";
	import SharedLayoutDemo from "$lib/components/demos/shared-layout-demo.svelte";
</script>

CSS layout properties like `width`, `flex` and `grid` are expensive to animate directly. Motion
Start instead measures the element before and after the change and animates the difference using
transforms — smooth, and cheap.

It's a single prop.

<DemoContainer class="py-8">
	<LayoutDemo />
</DemoContainer>

```svelte
<motion.div layout />
```

## Layout options

| Value              | Description                                                        |
| ------------------ | ------------------------------------------------------------------ |
| `layout`           | Animate both position and size.                                    |
| `layout="position"` | Animate position only — useful for text that shouldn't stretch.   |
| `layout="size"`    | Animate size only.                                                 |
| `layoutDependency`  | Only measure when this value changes, instead of on every render.  |
| `layoutRoot`       | Make this element the projection root for its subtree.             |
| `layoutScroll`     | Mark a scrollable ancestor so scroll offsets are accounted for.    |

## Scale correction

Because layout animations use `scale`, children can appear distorted. Give affected children their
own `layout` prop to correct them, and prefer `borderRadius` and `boxShadow` as motion values or
animated props so they're corrected automatically.

```svelte
<motion.div layout>
	<motion.span layout>label</motion.span>
</motion.div>
```

## Shared layout animations

Give two elements the same `layoutId` and Motion Start animates between them as the first unmounts
and the second mounts.

<DemoContainer class="flex justify-center py-10">
	<SharedLayoutDemo />
</DemoContainer>

```svelte
{#each tabs as tab (tab)}
	<button onclick={() => (selected = tab)}>
		{#if selected === tab}
			<motion.span layoutId="tab-pill" class="pill" />
		{/if}
		{tab}
	</button>
{/each}
```

Wrap the group in [`LayoutGroup`](/docs/components/layout-group) when the shared elements live in
different components, or when sibling components need to re-measure together.

<Callout type="warning" title="Migrating from AnimateSharedLayout">

`AnimateSharedLayout` was removed in `0.2`. Use `LayoutGroup` with `layoutId` instead — shared
layout animations no longer require a wrapper unless you need grouping.

</Callout>

## Layout and presence

Combine `layout` with [`AnimatePresence`](/docs/components/animate-presence) so surrounding items
reflow while an element animates out. Use `mode="popLayout"` to take the exiting element out of the
flow immediately.

```svelte
<AnimatePresence mode="popLayout">
	{#each items as item (item.id)}
		<motion.div layout exit={{ opacity: 0, scale: 0.8 }} />
	{/each}
</AnimatePresence>
```

## Troubleshooting

- **The element jumps.** Its nearest scrollable ancestor probably needs `layoutScroll`.
- **Nothing animates.** Layout animations need a layout change caused by a re-render; a transform
  change alone won't trigger one.
- **Text stretches.** Use `layout="position"`.
