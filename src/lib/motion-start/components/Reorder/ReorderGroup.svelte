<!-- Reorder.Group component for drag-to-reorder lists
Based on Motion v11.11.11 -->

<script lang="ts" generics="T">
  import { setContext } from "svelte";
  import { Motion } from "../../render/dom/motion.js";
  import { REORDER_CONTEXT_KEY } from "./ReorderContext.js";
  import type { ReorderGroupProps, ReorderContextValue } from "./types.js";

  type $$Props = ReorderGroupProps<T>;

  let {
    values,
    onReorder,
    axis = "y",
    children,
    layoutScroll = false,
    ...motionProps
  }: $$Props = $props();

  // Track reorder state
  let order = $state([...values]);

  // Update order when values prop changes
  $effect(() => {
    order = [...values];
  });

  const updateOrder = (item: T, offset: number) => {
    const index = order.indexOf(item);
    if (index === -1) return;

    const newOrder = [...order];
    const [removed] = newOrder.splice(index, 1);

    // Calculate new index based on offset
    const targetIndex = Math.max(0, Math.min(newOrder.length, index + Math.sign(offset)));
    newOrder.splice(targetIndex, 0, removed);

    order = newOrder;
    onReorder(newOrder);
  };

  const contextValue: ReorderContextValue<T> = {
    get axis() { return axis; },
    get values() { return order; },
    updateOrder
  };

  setContext(REORDER_CONTEXT_KEY, contextValue);
</script>

<Motion.div
  {...motionProps}
  layout={layoutScroll ? "position" : true}
  style={{
    position: "relative",
    ...motionProps.style
  }}
>
  {@render children?.({ values: order })}
</Motion.div>
