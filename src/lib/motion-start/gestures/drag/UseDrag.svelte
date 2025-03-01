<!-- based on framer-motion@4.1.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
  import { getContext, onDestroy, onMount } from "svelte";
  import { fromStore, get, type Writable } from "svelte/store";
  import {
    MotionConfigContext,
    type MotionConfigContextObject,
  } from "../../context/MotionConfigContext.js";
  import { VisualElementDragControls } from "./VisualElementDragControls.js";

  let { visualElement, props, isCustom, children } = $props();

  const mcc =
    getContext<Writable<MotionConfigContextObject>>(MotionConfigContext) ||
    MotionConfigContext(isCustom);

  let dragControls = new VisualElementDragControls({
    visualElement,
  });

  // If we've been provided a DragControls for manual control over the drag gesture,
  // subscribe this component to it on mount.
  let cleanup: () => void;
  const dragEffect = (dragControls?: VisualElementDragControls) => {
    if (cleanup) {
      cleanup();
    }
    if (groupDragControls) {
      cleanup = groupDragControls.subscribe(dragControls);
    }
  };
  const { dragControls: groupDragControls } = $derived(props);
  const { transformPagePoint } = $derived(fromStore(mcc).current);

  $effect(() => dragControls.setProps({ ...props, transformPagePoint }));

  $effect(() => dragEffect(dragControls));

  onDestroy(() => {
    if (cleanup) {
      cleanup();
    }
  });
  onMount(() => dragControls.mount(visualElement));
</script>

{@render children?.()}
