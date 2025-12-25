<!-- Reorder.Item component for individual reorderable items
Based on Motion v11.11.11 -->

<script lang="ts" generics="T">
  import { getContext } from "svelte";
  import { motion } from "../../render/dom/motion.js";
  import { REORDER_CONTEXT_KEY } from "./ReorderContext.js";
  import type { ReorderItemProps, ReorderContextValue } from "./types.js";

  type $$Props = ReorderItemProps<T>;

  let {
    value,
    children,
    dragListener = true,
    dragControls = undefined,
    ...motionProps
  }: $$Props = $props();

  const context = getContext<ReorderContextValue<T>>(REORDER_CONTEXT_KEY);

  if (!context) {
    throw new Error("Reorder.Item must be used within a Reorder.Group");
  }

  let isDragging = $state(false);
  let dragStartY = $state(0);
  let dragStartX = $state(0);

  const handleDragStart = (event: any) => {
    isDragging = true;
    if (context.axis === "y") {
      dragStartY = event.point.y;
    } else {
      dragStartX = event.point.x;
    }
    motionProps.onDragStart?.(event, event.point);
  };

  const handleDrag = (event: any, info: any) => {
    if (context.axis === "y") {
      const offset = info.offset.y;
      // You could calculate which item to swap with based on offset
      // For now, we'll just track the drag
    } else {
      const offset = info.offset.x;
      // Same for x-axis
    }
    motionProps.onDrag?.(event, info);
  };

  const handleDragEnd = (event: any, info: any) => {
    if (isDragging) {
      const offset = context.axis === "y" ? info.offset.y : info.offset.x;
      context.updateOrder(value, offset);
    }
    isDragging = false;
    motionProps.onDragEnd?.(event, info);
  };
</script>

<motion.div
  {...motionProps}
  drag={context.axis}
  dragListener={dragListener}
  dragControls={dragControls}
  layout={true}
  onDragStart={handleDragStart}
  onDrag={handleDrag}
  onDragEnd={handleDragEnd}
  style={{
    position: "relative",
    zIndex: isDragging ? 1 : 0,
    ...motionProps.style
  }}
>
  {@render children?.()}
</motion.div>
