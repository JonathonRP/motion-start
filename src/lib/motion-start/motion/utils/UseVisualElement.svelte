<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts" context="module" module>
  export const ssr = false;

  function createProjectionNode(
    visualElement: VisualElement<any>,
    props: MotionProps,
    ProjectionNodeConstructor: any,
    initialPromotionConfig?: InitialPromotionConfig,
  ) {
    const {
      layoutId,
      layout,
      drag,
      dragConstraints,
      layoutScroll,
      layoutRoot,
    } = props;

    visualElement.projection = new ProjectionNodeConstructor(
      visualElement.latestValues,
      props["data-framer-portal-id"]
        ? undefined
        : getClosestProjectingNode(visualElement.parent),
    ) as IProjectionNode;

    visualElement.projection.setOptions({
      layoutId,
      layout,
      alwaysMeasureLayout:
        Boolean(drag) || (dragConstraints && isRefObject(dragConstraints)),
      visualElement,
      /**
       * TODO: Update options in an effect. This could be tricky as it'll be too late
       * to update by the time layout animations run.
       * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
       * ensuring it gets called if there's no potential layout animations.
       *
       */
      animationType: typeof layout === "string" ? layout : "both",
      initialPromotionConfig,
      layoutScroll,
      layoutRoot,
    });
  }

  function getClosestProjectingNode(
    visualElement?: VisualElement<
      unknown,
      unknown,
      { allowProjection?: boolean }
    >,
  ): IProjectionNode | undefined {
    if (!visualElement) return undefined;

    return visualElement.options.allowProjection !== false
      ? visualElement.projection
      : getClosestProjectingNode(visualElement.parent);
  }
</script>

<script lang="ts" generics="Instance, RenderState">
  import { afterUpdate, beforeUpdate, getContext, onMount, tick } from "svelte";
  import { type Writable } from "svelte/store";
  import {
    SwitchLayoutGroupContext,
    type InitialPromotionConfig,
  } from "../../context/SwitchLayoutGroupContext";
  import {
    LazyContext,
    type LazyContextProps,
  } from "../../context/LazyContext";
  import {
    MotionConfigContext,
    type MotionConfigContext as MotionConfigContextProps,
  } from "../../context/MotionConfigContext";
  import {
    MotionContext,
    type MotionContextProps,
  } from "../../context/MotionContext";
  import {
    PresenceContext,
    type PresenceContextProps,
  } from "../../context/PresenceContext";
  import type { VisualElement } from "../../render/VisualElement";
  import type { CreateVisualElement } from "../../render/types";
  import type { MotionProps } from "../types";
  import type { VisualState } from "./use-visual-state";
  import type { IProjectionNode } from "../../projection/node/types";
  import { isRefObject } from "../../utils/is-ref-object.js";
  import { optimizedAppearDataAttribute } from "../../animation/optimized-appear/data-id";
  import { microtask } from "../../frameloop/microtask";

  export let Component: string,
    visualState: VisualState<Instance, RenderState>,
    props: MotionProps,
    createVisualElement: CreateVisualElement<Instance> | undefined = undefined,
    ProjectionNodeConstructor: any | undefined = undefined,
    isCustom;

  const mc =
    getContext<Writable<MotionContextProps>>(MotionContext) ||
    MotionContext(isCustom);

  const lazyContext =
    getContext<Writable<LazyContextProps>>(LazyContext) ||
    LazyContext(isCustom);

  const presenceContext =
    getContext<Writable<PresenceContextProps>>(PresenceContext) ||
    PresenceContext(isCustom);

  const mcc =
    getContext<Writable<MotionConfigContextProps>>(MotionConfigContext) ||
    MotionConfigContext(isCustom);

  let parent = $mc.visualElement;
  $: parent = $mc.visualElement;

  let reducedMotionConfig = $mcc.reducedMotion;
  $: reducedMotionConfig = $mcc.reducedMotion;

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
      parent,
      props,
      presenceContext: $presenceContext,
      blockInitialAnimation: $presenceContext?.initial === false,
      reducedMotionConfig,
    });
  }

  let visualElement: VisualElement | undefined = visualElementRef;
  $: visualElement = visualElementRef;

  const initialLayoutGroupConfig =
    getContext(SwitchLayoutGroupContext) || SwitchLayoutGroupContext(isCustom);

  $: if (
    visualElement &&
    !visualElement.projection &&
    ProjectionNodeConstructor &&
    (visualElement.type === "html" || visualElement.type === "svg")
  ) {
    createProjectionNode(
      visualElementRef!,
      props,
      ProjectionNodeConstructor,
      initialLayoutGroupConfig,
    );
  }

  let isMounted = false;
  onMount(() => (isMounted = true));

  beforeUpdate(() => {
    /**
     * Check the component has already mounted before calling
     * `update` unnecessarily. This ensures we skip the initial update.
     */
    if (visualElement && isMounted) {
      visualElement.update(props, $presenceContext);
    }
  });

  /**
   * Cache this value as we want to know whether HandoffAppearAnimations
   * was present on initial render - it will be deleted after this.
   */
  const optimisedAppearId =
    props[optimizedAppearDataAttribute as keyof typeof props];
  let wantsHandoff =
    Boolean(optimisedAppearId) &&
    !window.MotionHandoffIsComplete?.(optimisedAppearId) &&
    window.MotionHasOptimisedAnimation?.(optimisedAppearId);

  $: if (visualElement) {
    isMounted = true;
    window.MotionIsMounted = true;

    visualElement.updateFeatures();

    microtask.render(visualElement.render);

    /**
     * Ideally this function would always run in a useEffect.
     *
     * However, if we have optimised appear animations to handoff from,
     * it needs to happen synchronously to ensure there's no flash of
     * incorrect styles in the event of a hydration error.
     *
     * So if we detect a situtation where optimised appear animations
     * are running, we use useLayoutEffect to trigger animations.
     */
    if (wantsHandoff && visualElement.animationState) {
      visualElement.animationState.animateChanges();
    }
  }

  afterUpdate(() => {
    tick().then(() => {
      if (!visualElement) return;

      if (!wantsHandoff && visualElement.animationState) {
        visualElement.animationState.animateChanges();
      }

      if (wantsHandoff) {
        // This ensures all future calls to animateChanges() in this component will run in useEffect
        queueMicrotask(() => {
          window.MotionHandoffMarkAsComplete?.(optimisedAppearId);
        });

        wantsHandoff = false;
      }
    });
  });
</script>

<slot {visualElement} />
