<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts" context="module">
  import { isAnimationControls } from "../../animation/utils/is-animation-controls.js";
  import { resolveVariantFromProps } from "../../render/utils/resolve-variants.js";
  import {
    isControllingVariants as checkIsControllingVariants,
    isVariantNode as checkIsVariantNode,
  } from "../../render/utils/is-controlling-variants.js";
  import { resolveMotionValue } from "../../value/utils/resolve-motion-value.js";

  function makeState<I, RS>(
    {
      scrapeMotionValuesFromProps,
      createRenderState,
      onMount,
    }: UseVisualStateConfig<I, RS>,
    props: MotionProps,
    context: MotionContextProps,
    presenceContext: PresenceContextProps | null,
  ) {
    const state: VisualState<I, RS> = {
      latestValues: makeLatestValues(
        props,
        context,
        presenceContext,
        scrapeMotionValuesFromProps,
      ),
      renderState: createRenderState(),
    };

    if (onMount) {
      state.mount = (instance: I) => onMount(props, instance, state);
    }

    return state;
  }
  function makeLatestValues(
    props: MotionProps,
    context: MotionContextProps,
    presenceContext: PresenceContextProps | null,
    scrapeMotionValues: ScrapeMotionValuesFromProps,
  ) {
    const values: ResolvedValues = {};

    const motionValues = scrapeMotionValues(props);
    for (const key in motionValues) {
      values[key] = resolveMotionValue(motionValues[key]);
    }

    let { initial, animate } = props;
    const isControllingVariants = checkIsControllingVariants(props);
    const isVariantNode = checkIsVariantNode(props);

    if (
      context &&
      isVariantNode &&
      !isControllingVariants &&
      props.inherit !== false
    ) {
      if (initial === undefined) initial = context.initial;
      if (animate === undefined) animate = context.animate;
    }

    let isInitialAnimationBlocked = presenceContext
      ? presenceContext.initial === false
      : false;

    isInitialAnimationBlocked = isInitialAnimationBlocked || initial === false;

    const variantToSet = isInitialAnimationBlocked ? animate : initial;

    if (
      variantToSet &&
      typeof variantToSet !== "boolean" &&
      !isAnimationControls(variantToSet)
    ) {
      const list = Array.isArray(variantToSet) ? variantToSet : [variantToSet];
      list.forEach((definition) => {
        const resolved = resolveVariantFromProps(props, definition);
        if (!resolved) return;

        const { transitionEnd, transition, ...target } = resolved;
        for (const key in target) {
          let valueTarget = target[key as keyof typeof target];

          if (Array.isArray(valueTarget)) {
            /**
             * Take final keyframe if the initial animation is blocked because
             * we want to initialise at the end of that blocked animation.
             */
            const index = isInitialAnimationBlocked
              ? valueTarget.length - 1
              : 0;
            valueTarget = valueTarget[index];
          }

          if (valueTarget !== null) {
            values[key] = valueTarget as string | number;
          }
        }
        for (const key in transitionEnd)
          values[key] = transitionEnd[key as keyof typeof transitionEnd] as
            | string
            | number;
      });
    }

    return values;
  }
</script>

<script lang="ts" generics="Instance, RenderState">
  import type {
    UseVisualStateConfig,
    VisualState,
  } from "./use-visual-state.js";

  import type { MotionProps } from "../types";
  import type { Writable } from "svelte/store";

  import { getContext } from "svelte";
  import {
    MotionContext,
    type MotionContextProps,
  } from "../../context/MotionContext/index.js";
  import {
    PresenceContext,
    type PresenceContextProps,
  } from "../../context/PresenceContext.js";
  import type {
    ResolvedValues,
    ScrapeMotionValuesFromProps,
  } from "$lib/motion-start/render/types.js";

  type $$Props = {
    config: UseVisualStateConfig<Instance, RenderState>;
    props: MotionProps;
    isStatic: boolean;
    isCustom?: any | undefined;
  };

  export let config: $$Props["config"],
    props: $$Props["props"],
    isStatic: $$Props["isStatic"],
    isCustom: $$Props["isCustom"] = undefined;

  const context =
    getContext<Writable<MotionContextProps>>(MotionContext) ||
    MotionContext(isCustom);
  const presenceContext =
    getContext<Writable<PresenceContextProps>>(PresenceContext) ||
    PresenceContext(isCustom);
  const make = () => makeState(config, props, $context, $presenceContext);
  let state = make();
  $: if (!isStatic) {
    state = make();
  }
</script>

<slot {state} />
