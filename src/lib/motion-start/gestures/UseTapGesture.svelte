<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { pipe } from "popmotion";
  import {
    UsePointerEvent,
    addPointerEvent,
  } from "../events/use-pointer-event.js";
  import { AnimationType } from "../render/utils/types.js";
  import { isDragActive } from "./drag/utils/lock.js";
  import { isNodeOrChild } from "./utils/is-node-or-child.js";

  let { props, visualElement } = $props();

  let { onTap, onTapStart, onTapCancel, whileTap } = $derived(props);
  let hasPressListeners = $derived(onTap || onTapStart || onTapCancel || whileTap);

  let isPressing = $state(false);
  let cancelPointerEndListeners = $state<Function | null>(null);

  function removePointerEndListener() {
    cancelPointerEndListeners?.();
    cancelPointerEndListeners = null;
  }

  function checkPointerEnd() {
    removePointerEndListener();
    isPressing = false;
    visualElement.animationState?.setActive(AnimationType.Tap, false);
    return !isDragActive();
  }

  function onPointerUp(event: { target: Element | null | undefined }, info: any) {
    if (!checkPointerEnd()) return;

    /**
     * We only count this as a tap gesture if the event.target is the same
     * as, or a child of, this component's element
     */
    !isNodeOrChild(visualElement.getInstance(), event.target)
      ? onTapCancel?.(event, info)
      : onTap?.(event, info);
  }

  function onPointerCancel(event: any, info: any) {
    if (!checkPointerEnd()) return;

    onTapCancel?.(event, info);
  }

  function onPointerDown(event?: any, info?: any) {
    if (isPressing) return;
    removePointerEndListener();
    isPressing = true;

    cancelPointerEndListeners = pipe(
      // @ts-expect-error
      addPointerEvent(window, "pointerup", onPointerUp),
      addPointerEvent(window, "pointercancel", onPointerCancel)
    );

    onTapStart?.(event, info);

    visualElement.animationState?.setActive(AnimationType.Tap, true);
  }

  $effect(() => {
    return removePointerEndListener;
  });
</script>

<UsePointerEvent
  ref={visualElement}
  eventName="pointerdown"
  handler={hasPressListeners ? onPointerDown : undefined}
>
  <slot />
</UsePointerEvent>
