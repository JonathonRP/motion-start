---
title: LayoutGroup
description: Group components so they measure and animate layout together.
section: Components
---

<script>
	import { Callout, DemoContainer } from "@svecodocs/kit";
	import SharedLayoutDemo from "$lib/components/demos/shared-layout-demo.svelte";
</script>

Components measure their own layout when they re-render. `LayoutGroup` makes a set of components
re-measure together, so a change in one animates its siblings correctly — and it namespaces
`layoutId` so shared layout animations don't collide.

<DemoContainer class="flex justify-center py-10">
	<SharedLayoutDemo />
</DemoContainer>

```svelte
<script>
	import { motion, LayoutGroup } from "motion-start";

	let selected = $state("spring");
</script>

<LayoutGroup>
	{#each tabs as tab (tab)}
		<button onclick={() => (selected = tab)}>
			{#if selected === tab}
				<motion.span layoutId="pill" />
			{/if}
			{tab}
		</button>
	{/each}
</LayoutGroup>
```

## Props

| Prop      | Type                | Description                                                            |
| --------- | ------------------- | ---------------------------------------------------------------------- |
| `id`      | `string`            | Namespace for `layoutId`s within the group, so repeated groups don't share elements. |
| `inherit` | `boolean \| "id"`   | Whether to inherit the parent group's id. `false` isolates the group.  |

## Namespacing

When the same component is rendered more than once — an accordion, a list of cards — give each
instance its own `id` so their `layoutId`s stay distinct.

```svelte
{#each groups as group (group.id)}
	<LayoutGroup id={group.id}>
		<Accordion items={group.items} />
	</LayoutGroup>
{/each}
```

<Callout type="note" title="Replaces AnimateSharedLayout">

`AnimateSharedLayout` was removed in `0.2`. Shared layout animations now work without a wrapper —
reach for `LayoutGroup` when you need grouped re-measurement or namespacing.

</Callout>
