<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
  import { onDestroy, type Snippet } from "svelte";
  import { addDomEvent, type UseDomEventProps } from "./use-dom-event.js";

  interface Props extends UseDomEventProps {
    children?: Snippet;
  }

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
  let {
    ref,
    eventName,
    handler = undefined,
    options = undefined,
    children,
  }: Props = $props();
  let cleanup = () => {};
  const _cleanup = (
    ref?: any,
    eventName?: any,
    handler?: any,
    options?: any,
  ) => {
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

  $effect(() => {
    cleanup = _cleanup(ref, eventName, handler, options);
  });
  onDestroy(cleanup);
</script>

{@render children?.()}
