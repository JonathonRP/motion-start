<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { copyRawValuesOnly } from "../html/use-props.js";
  import { buildSVGAttrs } from "./utils/build-attrs.js";
  import { createSvgRenderState } from "./utils/create-render-state.js";

  export let visualState, props;
  let memo = () => {
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
  $: visualProps = memo(visualState);

  $: if (props.style) {
    const rawStyles = {};
    copyRawValuesOnly(rawStyles, props.style, props);
    visualProps.style = { ...rawStyles, ...visualProps.style };
  }
</script>

<slot {visualProps} />
