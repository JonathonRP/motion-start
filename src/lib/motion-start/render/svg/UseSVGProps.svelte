<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
  import { copyRawValuesOnly } from "../html/use-props.js";
  import { buildSVGAttrs } from "./utils/build-attrs.js";
  import { createSvgRenderState } from "./utils/create-render-state.js";

  let { visualState, props, children } = $props();

  let memo = (variantLabelsAsDependency?: string | boolean | undefined) => {
    const state = createSvgRenderState();
    buildSVGAttrs(
      state,
      visualState,
      undefined,
      undefined,
      { enableHardwareAcceleration: false },
      props.transformTemplate,
    );
    return {
      ...state.attrs,
      style: { ...state.style },
    };
  };
  const visualProps = $derived(memo(visualState));

  $effect(() => {
    if (props.style) {
      const rawStyles = {};
      copyRawValuesOnly(rawStyles, props.style, props);
      visualProps.style = { ...rawStyles, ...visualProps.style };
    }
  });
</script>

{@render children?.(visualProps)}
