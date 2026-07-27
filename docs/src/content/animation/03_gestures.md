---
title: Gestures
description: Hover, press, pan, drag and viewport detection, as animation props and event handlers.
section: Animation
---

<script>
	import { Callout, DemoContainer } from "@svecodocs/kit";
	import GestureDemo from "$lib/components/demos/gesture-demo.svelte";
	import DragDemo from "$lib/components/demos/drag-demo.svelte";
</script>

Motion Start extends Svelte's event listeners with a set of UI gestures. Each gesture has both a set
of event handlers and a `while-` animation prop that applies a temporary animation target.

<DemoContainer class="flex justify-center py-10">
	<GestureDemo />
</DemoContainer>

## Hover

`whileHover` applies while a pointer is over the element. Unlike `:hover`, it only fires for actual
mouse-like pointers, so it won't get stuck on touch devices.

```svelte
<motion.div
	whileHover={{ scale: 1.1 }}
	onHoverStart={(event, info) => {}}
	onHoverEnd={(event, info) => {}}
/>
```

## Press

`whileTap` applies from pointer-down until pointer-up. `onTap` only fires when the pointer is
released over the same element, so dragging away cancels it.

```svelte
<motion.button
	whileTap={{ scale: 0.94 }}
	onTapStart={(event, info) => {}}
	onTap={(event, info) => {}}
	onTapCancel={(event, info) => {}}
/>
```

## Focus

`whileFocus` follows the `:focus-visible` rules — it applies on keyboard focus, not on click.

```svelte
<motion.input whileFocus={{ scale: 1.02 }} />
```

## Pan

Pan recognises a pointer moving across an element without moving the element itself.

```svelte
<motion.div
	onPanStart={(event, info) => {}}
	onPan={(event, info) => console.log(info.offset.x, info.velocity.x)}
	onPanEnd={(event, info) => {}}
/>
```

`info` is a `PanInfo`: `point`, `delta`, `offset` and `velocity`.

## Drag

<DemoContainer class="py-8">
	<DragDemo />
</DemoContainer>

```svelte
<motion.div
	drag
	dragConstraints={{ top: 0, left: 0, right: 240, bottom: 60 }}
	dragElastic={0.2}
	whileDrag={{ scale: 1.1, cursor: "grabbing" }}
/>
```

| Prop              | Description                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| `drag`            | `true`, `"x"` or `"y"`.                                                      |
| `dragConstraints` | Pixel bounds, or a ref to an element to stay within.                         |
| `dragElastic`     | `0`–`1`, how far past the constraints the element can be dragged.            |
| `dragMomentum`    | Whether to continue with inertia on release. Defaults to `true`.             |
| `dragSnapToOrigin` | Animate back to the origin on release.                                      |
| `dragControls`    | A `DragControls` instance for starting drags from another element.           |
| `dragListener`    | Set to `false` to only start drags via `dragControls`.                       |

### Drag controls

Start a drag from a handle, or anywhere else:

```svelte
<script>
	import { motion, useDragControls } from "motion-start";

	const controls = useDragControls();
</script>

<div onpointerdown={(event) => controls.start(event, { snapToCursor: true })}>handle</div>

<motion.div drag dragControls={controls} dragListener={false} />
```

## Viewport

`whileInView` animates when the element enters the viewport, and `viewport` configures detection.

```svelte
<motion.div
	initial={{ opacity: 0, y: 40 }}
	whileInView={{ opacity: 1, y: 0 }}
	viewport={{ once: true, amount: 0.5 }}
	onViewportEnter={(entry) => {}}
	onViewportLeave={(entry) => {}}
/>
```

| Option   | Description                                                            |
| -------- | ---------------------------------------------------------------------- |
| `once`   | Only animate the first time the element enters.                        |
| `amount` | `"some"`, `"all"`, or a `0`–`1` threshold.                             |
| `margin` | A root margin, e.g. `"0px 0px -100px 0px"`.                            |
| `root`   | A ref to a scrollable ancestor to use instead of the viewport.         |

<Callout type="tip" title="Gesture priority">

`while-` props are applied in order of priority: `whileHover`, `whileTap`, `whileDrag`,
`whileFocus`, `whileInView`. A later gesture overrides values set by an earlier one, and the element
animates back down the stack as gestures end.

</Callout>
