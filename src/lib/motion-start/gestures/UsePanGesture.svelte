<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { afterUpdate, getContext, onDestroy } from "svelte";
  import { get } from "svelte/store";
  import { MotionConfigContext } from "../context/MotionConfigContext.js";
  import { UsePointerEvent } from "../events/use-pointer-event";
  import { PanSession } from "./PanSession";

  export let props,
    visualElement,
    isCustom = false;
  let { onPan, onPanStart, onPanEnd, onPanSessionStart } = props;
  $: ({ onPan, onPanStart, onPanEnd, onPanSessionStart } = props);
  $: hasPanEvents = onPan || onPanStart || onPanEnd || onPanSessionStart;
  let panSession: PanSession | null = null;
  const mcc = getContext(MotionConfigContext) || MotionConfigContext(isCustom);
  // @ts-expect-error
  $: ( { transformPagePoint } = get(mcc));
  // $: ({ transformPagePoint } = $mcc);
  let handlers = {
    onSessionStart: onPanSessionStart,
    onStart: onPanStart,
    onMove: onPan,
    onEnd: (event: any, info: any) => {
      panSession = null;
      onPanEnd && onPanEnd(event, info);
    },
  };
  $: handlers = {
    onSessionStart: onPanSessionStart,
    onStart: onPanStart,
    onMove: onPan,
    onEnd: (event, info) => {
      panSession = null;
      onPanEnd && onPanEnd(event, info);
    },
  };
  function onPointerDown(event: PointerEvent) {
    panSession = new PanSession(event, handlers, {
      transformPagePoint,
    });
  }
  afterUpdate(() => {
    if (panSession !== null) {
      panSession.updateHandlers(handlers);
    }
  });
  onDestroy(() => panSession && panSession.end());
</script>

<UsePointerEvent
  ref={visualElement}
  eventName="pointerdown"
  handler={hasPanEvents && onPointerDown}
>
  <slot />
</UsePointerEvent>
