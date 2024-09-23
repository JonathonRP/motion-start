<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts" module>
  import type { EventListenerWithPointInfo } from "./event-info.js";
  import { UseDomEvent } from "./use-dom-event.js";
  import {
    supportsMouseEvents,
    supportsPointerEvents,
    supportsTouchEvents,
  } from "./utils.js";

  const mouseEventNames = {
    pointerdown: "mousedown",
    pointermove: "mousemove",
    pointerup: "mouseup",
    pointercancel: "mousecancel",
    pointerover: "mouseover",
    pointerout: "mouseout",
    pointerenter: "mouseenter",
    pointerleave: "mouseleave",
  };

  const touchEventNames = {
    pointerdown: "touchstart",
    pointermove: "touchmove",
    pointerup: "touchend",
    pointercancel: "touchcancel",
  };
  function getPointerEventName(name: string) {
    if (supportsPointerEvents()) {
      return name;
    } else if (supportsTouchEvents()) {
      return (touchEventNames as any)[name];
    } else if (supportsMouseEvents()) {
      return (mouseEventNames as any)[name];
    }

    return name;
  }
  export function addPointerEvent(
    target: EventTarget,
    eventName: string,
    handler: EventListenerWithPointInfo,
    options?: AddEventListenerOptions
  ) {
    return addDomEvent(
      target,
      getPointerEventName(eventName),
      wrapHandler(handler, eventName === "pointerdown"),
      options
    );
  }
</script>

<script lang="ts">
  import { wrapHandler } from "./event-info.js";
  import { addDomEvent } from "./use-dom-event.js";
  import type { UsePointerEventProps } from "./use-pointer-event.js";

  type $$Props = UsePointerEventProps;

  export let ref: $$Props["ref"],
    eventName: $$Props["eventName"],
    handler: $$Props["handler"] = undefined,
    options: $$Props["options"] = undefined;
</script>

<UseDomEvent
  {ref}
  eventName={getPointerEventName(eventName)}
  handler={handler && wrapHandler(handler, eventName === "pointerdown")}
  {options}
>
  <slot />
</UseDomEvent>
