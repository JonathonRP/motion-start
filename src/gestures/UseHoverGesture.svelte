<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script module lang="ts">
  import { isDragActive } from "./drag/utils/lock.js";
  function createHoverEvent(visualElement, isActive, callback) {
    return (event, info) => {
      if (!isMouseEvent(event) || isDragActive()) return;
      callback?.(event, info);

      visualElement.animationState?.setActive(AnimationType.Hover, isActive);
    };
  }
</script>

<script lang="ts">
  import { UsePointerEvent } from "../events/use-pointer-event.js";
  import { AnimationType } from "../render/utils/types.js";
  import { isMouseEvent } from "./utils/event-type.js";

  export let props, visualElement;
  let { onHoverStart, onHoverEnd, whileHover } = props;
  $: ({ onHoverStart, onHoverEnd, whileHover } = props);
</script>

<UsePointerEvent
  ref={visualElement}
  eventName="pointerenter"
  handler={onHoverStart || whileHover
    ? createHoverEvent(visualElement, true, onHoverStart)
    : undefined}
/>
<UsePointerEvent
  ref={visualElement}
  eventName="pointerleave"
  handler={onHoverEnd || whileHover
    ? createHoverEvent(visualElement, false, onHoverEnd)
    : undefined}
/>
<slot />
