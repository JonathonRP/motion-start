<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts" context="module">
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
    import type { VisualElement } from "../../render/types.js";

  export let createVisualElement = undefined,
    props,
    Component,
    visualState,
    isCustom;

  const config =
    getContext<Writable<MotionConfigContextObject>>(MotionConfigContext) || MotionConfigContext(isCustom);

  const presenceContext =
    getContext<Writable<PresenceContextProps>>(PresenceContext) || PresenceContext(isCustom);

  const lazyContext =
    getContext<Writable<LazyContextProps>>(LazyContext) || LazyContext(isCustom);

  const mc =
    getContext<Writable<MotionContextProps>>(MotionContext) || MotionContext(isCustom);

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

  let visualElementRef: VisualElement | undefined = undefined;
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

  let visualElement: VisualElement | undefined = visualElementRef;
  $:(visualElement = visualElementRef);

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
      visualElement?.animationState?.animateChanges();
    });
  });

  onDestroy(() => {
    visualElement?.notifyUnmount();
  });
</script>

<slot {visualElement} />
