<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts" context="module">
  export function addDomEvent(
    target: EventTarget,
    eventName: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ) {
    target.addEventListener(eventName, handler, options);
    return function () {
      return target.removeEventListener(eventName, handler, options);
    };
  }
</script>

<script lang="ts">
  import { onDestroy } from "svelte";
  import type { UseDomEventProps } from "./use-dom-event.js";

  type $$Props = UseDomEventProps;

  /**
   * Attaches an event listener directly to the provided DOM element.
   *
   * Bypassing React's event system can be desirable, for instance when attaching non-passive
   * event handlers.
   *
   * ```jsx
   * const ref = useRef(null)
   *
   * useDomEvent(ref, 'wheel', onWheel, { passive: false })
   *
   * return <div ref={ref} />
   * ```
   *
   * @param ref - React.RefObject that's been provided to the element you want to bind the listener to.
   * @param eventName - Name of the event you want listen for.
   * @param handler - Function to fire when receiving the event.
   * @param options - Options to pass to `Event.addEventListener`.
   *
   * @public
   */
  export let ref: $$Props["ref"],
    eventName: $$Props["eventName"],
    handler: $$Props["handler"] = undefined,
    options: $$Props["options"] = undefined;
  let cleanup = () => {};
  const effect = (ref?:any, eventName?:any, handler?:any, options?:any) => {
    cleanup();
    if (!ref) {
      return () => {};
    }
    const element = ref.current;

    if (handler && element) {
      return addDomEvent(element, eventName, handler, options);
    }
    return () => {};
  };

  $: cleanup = effect(ref, eventName, handler, options);
  onDestroy(cleanup);
</script>

<slot />
