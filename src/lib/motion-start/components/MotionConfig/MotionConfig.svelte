<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { getContext, setContext } from "svelte";
  import { get, writable, type Writable } from "svelte/store";
  import { setDomContext } from "../../context/DOMcontext.js";
  import {
    MotionConfigContext,
    type MotionConfigContextObject,
  } from "../../context/MotionConfigContext.js";
  import { provideScaleCorrection } from "../../context/ScaleCorrectionProvider.svelte";
  import { scaleCorrection } from "./MotionConfigScaleCorrection.js";
  import type { MotionConfigProps } from "./index.js";

  type $$Props = MotionConfigProps;

  export let transformPagePoint: $$Props["transformPagePoint"] = undefined,
    isStatic: $$Props["isStatic"] = undefined,
    transition: $$Props["transition"] = undefined,
    isCustom = false;
  const mcc =
    getContext<Writable<MotionConfigContextObject>>(MotionConfigContext) ||
    MotionConfigContext(isCustom);
  /**
   * Inherit props from any parent MotionConfig components
   */
  let config = { ...get(mcc), ...{ transformPagePoint, isStatic, transition } };
  $: config = { ...$mcc, ...{ transformPagePoint, isStatic, transition } };

  // need to inform child layouts, or problems with scroll occur
  provideScaleCorrection();
  /**
   * Don't allow isStatic to change between renders as it affects how many hooks
   * motion components fire.
   */
  //config.isStatic = useConstant(() => config.isStatic)

  /**
   * Creating a new config context object will re-render every `motion` component
   * every time it renders. So we only want to create a new one sparingly.
   */
  $: transitionDependency =
    typeof config.transition === "object" ? config.transition.toString() : "";

  let context = writable(config);
  setContext(MotionConfigContext, context);
  setDomContext("Motion", isCustom, context);
  const memo = () => config;
  const scaleCorrector = scaleCorrection();
  $: {
    // @ts-expect-error
    context.set(memo(transitionDependency, config.transformPagePoint));
    scaleCorrector.update();
  }
</script>

<slot />
