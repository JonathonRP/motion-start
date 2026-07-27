---
title: LazyMotion
description: Code-split animation features to keep the initial bundle small.
section: Components
---

<script>
	import { Callout } from "@svecodocs/kit";
</script>

The full `motion` component bundles every feature. `LazyMotion` lets you ship the much smaller `m`
component and load only the features you need — synchronously or asynchronously.

```svelte
<script>
	import { LazyMotion, domAnimation } from "motion-start";
	import { m } from "motion-start/m";
</script>

<LazyMotion features={domAnimation}>
	<m.div animate={{ opacity: 1 }} />
</LazyMotion>
```

## Feature bundles

| Bundle         | Contents                                                                |
| -------------- | ----------------------------------------------------------------------- |
| `domMin`       | Animations only.                                                        |
| `domAnimation` | Animations, variants, exit animations and hover/tap/focus gestures.      |
| `domMax`       | Everything, including pan, drag and layout animations.                   |

## Loading asynchronously

Pass a function returning a promise to defer loading until after first paint.

```svelte
<script>
	import { LazyMotion } from "motion-start";
	import { m } from "motion-start/m";

	const loadFeatures = () => import("motion-start").then((res) => res.domMax);
</script>

<LazyMotion features={loadFeatures} strict>
	<m.div animate={{ x: 100 }} />
</LazyMotion>
```

## Props

| Prop       | Type                                  | Description                                                          |
| ---------- | ------------------------------------- | -------------------------------------------------------------------- |
| `features` | `FeatureBundle \| () => Promise<…>`    | The bundle to load, directly or lazily.                              |
| `strict`   | `boolean`                             | Throw if a full `motion` component renders inside, which would undo the code-splitting. |

<Callout type="tip" title="Use strict in development">

`strict` makes accidental `motion` imports inside a `LazyMotion` tree a loud error rather than a
silent bundle-size regression.

</Callout>
