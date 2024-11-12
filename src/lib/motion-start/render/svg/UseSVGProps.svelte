<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import type { MotionProps } from "../../motion/types.js";
  import type { ResolvedValues } from "../types.js";
  import { copyRawValuesOnly } from "../html/use-props.js";
  import { buildSVGAttrs } from "./utils/build-attrs.js";
  import { createSvgRenderState } from "./utils/create-render-state.js";
  import { isSVGTag } from "./utils/is-svg-tag.js";

  export let props: MotionProps, visualState: ResolvedValues, Component: string;

  let memo = (_visualState: typeof visualState) => {
    const state = createSvgRenderState();
    buildSVGAttrs(
      state,
      _visualState,
      isSVGTag(Component),
      props.transformTemplate,
    );
    return {
      ...state.attrs,
      style: { ...state.style },
    };
  };
  $: visualProps = memo(visualState);

  $: if (props.style) {
    const rawStyles = {};
    copyRawValuesOnly(rawStyles, props.style as any, props);
    visualProps.style = { ...rawStyles, ...visualProps.style };
  }
</script>

<slot {visualProps} />
