<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script module lang="ts">
  export const ssr = false;
</script>

<script lang="ts">
  import { afterUpdate, getContext, onDestroy, tick } from "svelte";
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

  export let createVisualElement = undefined,
    props,
    Component,
    visualState,
    isCustom;

  const config: Writable<MotionConfigContextObject> =
    getContext(MotionConfigContext) || MotionConfigContext(isCustom);
  const presenceContext: Writable<PresenceContextProps> =
    getContext(PresenceContext) || PresenceContext(isCustom);
  const lazyContext: Writable<LazyContextProps> =
    getContext(LazyContext) || LazyContext(isCustom);
  const mc: Writable<MotionContextProps> =
    getContext(MotionContext) || MotionContext(isCustom);
  let parent = get(mc).visualElement;
  $: parent = $mc.visualElement;
  const layoutGroupId: Writable<string | null> =
    getContext(LayoutGroupContext) || LayoutGroupContext(isCustom);
  let layoutId =
    $layoutGroupId && props.layoutId !== undefined
      ? $layoutGroupId + "-" + props.layoutId
      : props.layoutId;
  $: layoutId =
    $layoutGroupId && props.layoutId !== undefined
      ? $layoutGroupId + "-" + props.layoutId
      : props.layoutId;

  let visualElementRef: any = undefined;
  /**
   * If we haven't preloaded a renderer, check to see if we have one lazy-loaded
   */
  if (!createVisualElement) {
    createVisualElement = $lazyContext.renderer;
  }

  $: if (!visualElementRef && createVisualElement) {
    visualElementRef = createVisualElement(Component, {
      visualState,
      parent: parent,
      props: { ...props, layoutId },
      presenceId: $presenceContext?.id,
      blockInitialAnimation: $presenceContext?.initial === false,
    });
  }
  let visualElement = visualElementRef;
  $: visualElement = visualElementRef;

  $: if (visualElement) {
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
  }

  afterUpdate(() => {
    tick().then(() => {
      visualElement.animationState?.animateChanges();
    });
  });

  onDestroy(() => {
    visualElement?.notifyUnmount();
  });
</script>

<slot {visualElement} />
