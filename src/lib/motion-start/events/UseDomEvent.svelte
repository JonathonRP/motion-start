<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { onDestroy, type Snippet } from "svelte";
  import { addDomEvent } from "./add-dom-event";
  import type { UseDomEventProps } from "./use-dom-event";
  import type { RefObject } from "../utils/safe-react-types";

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
    ref: RefObject<EventTarget>,
    eventName: string,
    handler?: EventListener | undefined,
    options?: AddEventListenerOptions,
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
