<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { buildHTMLStyles } from "./utils/build-styles.js";

  import { createHtmlRenderState } from "./utils/create-render-state.js";
  export let visualState, isStatic, props;
  const memo = (variantLabelsAsDependency?:string | boolean | undefined) => {
    let state = createHtmlRenderState();

    buildHTMLStyles(
      state,
      visualState,
      undefined,
      undefined,
      { enableHardwareAcceleration: !isStatic },
      props.transformTemplate
    );

    const { vars, style } = state;
    return { ...vars, ...style };
  };
  $: styles = memo(visualState);
</script>

<slot {styles} />
