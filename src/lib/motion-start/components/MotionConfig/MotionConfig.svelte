<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
  import {
    setMotionConfigContext,
    useMotionConfig,
  } from "../../context/MotionConfigContext.js";
  import type { MotionConfigProps } from "./index.js";
  import { loadExternalIsValidProp } from "../../render/dom/utils/filter-props.js";
  import type { Snippet } from "svelte";

  interface Props extends MotionConfigProps {
    children: Snippet;
  }

  let {
    isValidProp,
    children,
    transition,
    reducedMotion,
    nonce,
    isStatic,
    transformPagePoint,
  }: Props = $props();

  isValidProp && loadExternalIsValidProp(isValidProp);

  const parentConfig = useMotionConfig();
  /**
   * Inherit props from any parent MotionConfig components
   */
  const config = $state({
    transition: transition ?? parentConfig.transition,
    reducedMotion: reducedMotion ?? parentConfig.reducedMotion,
    nonce: nonce ?? parentConfig.nonce,
    isStatic: isStatic ?? parentConfig.isStatic,
    transformPagePoint: transformPagePoint ?? parentConfig.transformPagePoint,
  });

  setMotionConfigContext(config);
</script>

{@render children?.()}
