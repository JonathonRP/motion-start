<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { getContext, setContext } from "svelte";
  import { get, writable } from "svelte/store";
  import { setDomContext } from "../../context/DOMcontext.js";
  import { MotionConfigContext } from "../../context/MotionConfigContext.js";
  import type { MotionConfigProps } from "./index.js";
  import { loadExternalIsValidProp } from "../../render/dom/utils/filter-props.js";

  type $$Props = MotionConfigProps;

  export let isValidProp: $$Props["isValidProp"] = undefined,
    transformPagePoint: $$Props["transformPagePoint"] = undefined,
    isStatic: $$Props["isStatic"] = undefined,
    transition: $$Props["transition"] = undefined,
    isCustom = false;

  isValidProp && loadExternalIsValidProp(isValidProp);

  const mcc =
    getContext<ReturnType<typeof MotionConfigContext>>(MotionConfigContext) ||
    MotionConfigContext(isCustom);
  /**
   * Inherit props from any parent MotionConfig components
   */
  let config = { ...get(mcc), ...{ transformPagePoint, isStatic, transition } };
  $: config = { ...$mcc, ...{ transformPagePoint, isStatic, transition } };

  /**
   * Don't allow isStatic to change between renders as it affects how many hooks
   * motion components fire.
   */
  //config.isStatic = useConstant(() => config.isStatic)

  /**
   * Creating a new config context object will re-render every `motion` component
   * every time it renders. So we only want to create a new one sparingly.
   */
  let context = writable(config);
  setContext(MotionConfigContext, context);
  setDomContext("Motion", isCustom, context);
  const memo = (..._args: any[]) => config;
  $: {
    context.set(
      memo(
        JSON.stringify(config.transition),
        config.transformPagePoint,
        config.reducedMotion,
      ),
    );
  }
</script>

<slot />
