<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
  import { useContext } from "../../context/utils/context.js";
  import { MotionConfigContext } from "../../context/MotionConfigContext.js";
  import type { MotionConfigProps } from "./index.js";
  import { loadExternalIsValidProp } from "../../render/dom/utils/filter-props.js";

  interface Props extends MotionConfigProps {}

  let {
    isValidProp,
    transformPagePoint,
    isStatic,
    transition,
    children,
  }: Props = $props();

  isValidProp && loadExternalIsValidProp(isValidProp);

  /**
   * Inherit props from any parent MotionConfig components
   */
  const config = $derived({
    ...useContext(MotionConfigContext).current,
    ...{
      transformPagePoint: transformPagePoint!,
      isStatic: isStatic!,
      transition,
    },
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
    MotionConfigContext.Provider = config;
  });
</script>

{@render children?.()}
