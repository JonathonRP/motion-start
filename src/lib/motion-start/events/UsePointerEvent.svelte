<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->
<script lang="ts">
  import { UseDomEvent } from "./use-dom-event.js";
  import { wrapHandler } from "./event-info.js";
  import { getPointerEventName, type UsePointerEventProps } from "./use-pointer-event.js";
  type $$Props = UsePointerEventProps;

  export let ref:$$Props["ref"] | any ,
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
