<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
  import { useContext } from "../../context/utils/context.svelte.js";
  import { MotionConfigContext } from "../../context/MotionConfigContext.js";
  import type { MotionConfigProps } from "./index.js";
  import { loadExternalIsValidProp } from "../../render/dom/utils/filter-props.js";
  import { fromStore } from "svelte/store";

  interface Props extends MotionConfigProps {
    isCustom?: boolean;
  }

  let {
    isValidProp,
    transformPagePoint,
    isStatic,
    transition,
    isCustom = false,
    children,
  }: Props = $props();

  isValidProp && loadExternalIsValidProp(isValidProp);

  let mcc = fromStore(useContext(MotionConfigContext, isCustom)).current;
  /**
   * Inherit props from any parent MotionConfig components
   */
  const config = $derived({
    ...mcc,
    ...{ transformPagePoint, isStatic, transition },
  });

  /**
   * Don't allow isStatic to change between renders as it affects how many hooks
   * motion components fire.
   */
  //config.isStatic = useConstant(() => config.isStatic)

  $effect.pre(() => {
    /**
     * Creating a new config context object will re-render every `motion` component
     * every time it renders. So we only want to create a new one sparingly.
     */
    MotionConfigContext.Provider = config as any;
  });

  const memo = (..._args: any[]) => config;
  $effect.pre(() => {
    mcc = memo(
      JSON.stringify(config.transition),
      config.transformPagePoint,
      config.reducedMotion,
    ) as any;
  });
</script>

{@render children?.()}
