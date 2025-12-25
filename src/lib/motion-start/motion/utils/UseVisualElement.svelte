<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts" context="module">
  export const ssr = false;
</script>

<script lang="ts">
  import { getContext, tick, untrack } from "svelte";
  import { get, type Writable } from "svelte/store";
  import { isPresent } from "../../components/AnimatePresence/use-presence.js";
  import { LayoutGroupContext } from "../../context/LayoutGroupContext.js";
  import {
    LazyContext,
    type LazyContextProps,
  } from "../../context/LazyContext.js";
  import {
    MotionConfigContext,
    type MotionConfigContextObject,
  } from "../../context/MotionConfigContext.js";
  import {
    MotionContext,
    type MotionContextProps,
  } from "../../context/MotionContext/index.js";
  import {
    PresenceContext,
    type PresenceContextProps,
  } from "../../context/PresenceContext.js";
  import type { VisualElement } from "../../render/types.js";

  let {
    createVisualElement = undefined,
    props,
    Component,
    visualState,
    isCustom
  } = $props();

  const config =
    getContext<Writable<MotionConfigContextObject>>(MotionConfigContext) || MotionConfigContext(isCustom);

  const presenceContext =
    getContext<Writable<PresenceContextProps>>(PresenceContext) || PresenceContext(isCustom);

  const lazyContext =
    getContext<Writable<LazyContextProps>>(LazyContext) || LazyContext(isCustom);

  const mc =
    getContext<Writable<MotionContextProps>>(MotionContext) || MotionContext(isCustom);

  let parent = $derived($mc.visualElement);

  const layoutGroupId: Writable<string | null> =
    getContext(LayoutGroupContext) || LayoutGroupContext(isCustom);

  let layoutId = $derived(
    $layoutGroupId && props.layoutId !== undefined
      ? $layoutGroupId + "-" + props.layoutId
      : props.layoutId
  );

  let visualElementRef = $state<VisualElement | undefined>(undefined);

  /**
   * If we haven't preloaded a renderer, check to see if we have one lazy-loaded
   */
  $effect(() => {
    if (!createVisualElement) {
      createVisualElement = $lazyContext.renderer;
    }

    if (!visualElementRef && createVisualElement) {
      visualElementRef = createVisualElement(Component, {
        visualState,
        parent: parent,
        props: { ...props, layoutId },
        presenceId: $presenceContext?.id,
        blockInitialAnimation: $presenceContext?.initial === false,
      });
    }
  });

  let visualElement = $derived(visualElementRef);

  $effect(() => {
    if (visualElement) {
      visualElement.setProps({
        ...$config,
        ...props,
        layoutId,
      });
      visualElement.isPresent = isPresent($presenceContext);
      visualElement.isPresenceRoot =
        !parent || parent.presenceId !== $presenceContext?.id;

      /**
       * Fire a render to ensure the latest state is reflected on-screen.
       */
      visualElement.syncRender();

      tick().then(() => {
        visualElement?.animationState?.animateChanges();
      });
    }
  });

  $effect(() => {
    return () => {
      visualElement?.notifyUnmount();
    };
  });
</script>

<slot {visualElement} />
