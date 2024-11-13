<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script context="module" module lang="ts">
  import { DragControls } from "./use-drag-controls";
  const createDragControls = () => new DragControls();
</script>

<script lang="ts">
  /**
   * Usually, dragging is initiated by pressing down on a `motion` component with a `drag` prop
   * and moving it. For some use-cases, for instance clicking at an arbitrary point on a video scrubber, we
   * might want to initiate that dragging from a different component than the draggable one.
   *
   * By creating a `dragControls` using the `useDragControls` hook, we can pass this into
   * the draggable component's `dragControls` prop. It exposes a `start` method
   * that can start dragging from pointer events on other components.
   *
   * @library
   *
   * ```jsx
   * const dragControls = useDragControls()
   *
   * function startDrag(event) {
   *   dragControls.start(event, { snapToCursor: true })
   * }
   *
   * return (
   *   <>
   *     <Frame onTapStart={startDrag} />
   *     <Frame drag="x" dragControls={dragControls} />
   *   </>
   * )
   * ```
   *
   * @motion
   *
   * ```jsx
   * const dragControls = useDragControls()
   *
   * function startDrag(event) {
   *   dragControls.start(event, { snapToCursor: true })
   * }
   *
   * return (
   *   <>
   *     <div onPointerDown={startDrag} />
   *     <MotionDiv drag="x" dragControls={dragControls} />
   *   </>
   * )
   * ```
   *
   * @public
   */

  let dragControls = createDragControls();
</script>

<slot {dragControls} />
