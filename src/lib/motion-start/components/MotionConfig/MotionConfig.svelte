<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { getContext, setContext } from "svelte";
  import { setDomContext } from "../../context/DOMcontext.js";
  import {
    MotionConfigContext,
    MOTION_CONFIG_CONTEXT_KEY,
    type MotionConfigContextObject,
  } from "../../context/MotionConfigContext.js";
  import { provideScaleCorrection } from "../../context/ScaleCorrectionProvider.svelte";
  import { scaleCorrection } from "./MotionConfigScaleCorrection.js";
  import type { MotionConfigProps } from "./index.js";

  type $$Props = MotionConfigProps;

  let {
    transformPagePoint = undefined,
    isStatic = undefined,
    transition = undefined,
    isCustom = false
  }: $$Props = $props();

  const mcc =
    getContext<MotionConfigContextObject>(MOTION_CONFIG_CONTEXT_KEY) ||
    MotionConfigContext(isCustom);

  /**
   * Inherit props from any parent MotionConfig components
   */
  let config = $state<MotionConfigContextObject>({
    ...mcc,
    ...{ transformPagePoint, isStatic, transition }
  });

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
  let transitionDependency = $derived(
    typeof config.transition === "object" ? config.transition.toString() : ""
  );

  setContext(MOTION_CONFIG_CONTEXT_KEY, config);
  setDomContext("MotionConfig", isCustom, config);
  const scaleCorrector = scaleCorrection();

  $effect(() => {
    // Update config properties reactively
    Object.assign(config, { transformPagePoint, isStatic, transition });
    scaleCorrector.update();
  });
</script>

<slot />
