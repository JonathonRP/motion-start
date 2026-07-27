---
title: AnimatePresence
description: Animate elements out before Svelte removes them from the DOM.
section: Components
---

<script>
	import { Callout, PropField, DemoContainer } from "@svecodocs/kit";
	import PresenceDemo from "$lib/components/demos/presence-demo.svelte";
</script>

Svelte removes elements from the DOM as soon as an `{#if}` or `{#each}` block changes.
`AnimatePresence` coordinates with Svelte's outro system so motion children can run their `exit`
animation first.

<DemoContainer class="py-8">
	<PresenceDemo />
</DemoContainer>

```svelte
<script>
	import { motion, AnimatePresence } from "motion-start";

	let visible = $state(true);
</script>

<AnimatePresence>
	{#if visible}
		<motion.div
			initial={{ opacity: 0, scale: 0.6 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.6 }}
		/>
	{/if}
</AnimatePresence>
```

## Props

<PropField name="mode" type='"sync" | "wait" | "popLayout"' defaultValue='"sync"'>
`sync` uses Svelte's normal outro layout. `wait` finishes the exit animation before the next element
enters. `popLayout` removes exiting elements from the layout flow while keeping their measured
visual position, so siblings reflow immediately.
</PropField>

<PropField name="initial" type="boolean" defaultValue="true">
Set to `false` to disable the mount animation for children present on first render.
</PropField>

<PropField name="custom" type="unknown">
Data passed to dynamic `exit` variants, so an element can animate out differently depending on
context.
</PropField>

<PropField name="presenceAffectsLayout" type="boolean" defaultValue="true">
Whether presence changes trigger layout projection in sibling `layout` components.
</PropField>

<PropField name="onExitComplete" type="() => void">
Called once every exiting element in the current batch has finished animating.
</PropField>

## Keyed lists

Inside `{#each}`, use a keyed block so identity is stable across updates.

```svelte
<AnimatePresence mode="popLayout">
	{#each items as item (item.id)}
		<motion.li
			layout
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
		>
			{item.label}
		</motion.li>
	{/each}
</AnimatePresence>
```

## Presence hooks

`usePresence` and `useIsPresent` let a child read its own presence state — useful when the exit
animation isn't driven by an `exit` prop.

```svelte
<script>
	import { usePresence } from "motion-start";

	const [isPresent, safeToRemove] = usePresence();
</script>
```

`usePresenceData` reads the `custom` value from the nearest `AnimatePresence`.

<Callout type="warning" title="Migrating">

`presenceAffectsLayout` was a no-op before `0.1.21` and now behaves as documented. If you relied on
the old behaviour, set it to `false` explicitly.

</Callout>
