<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import type { MotionProps } from "$lib/motion-start/motion/types.js";
  import type { ResolvedValues } from "../types.js";
  import { buildHTMLStyles } from "./utils/build-styles.js";

  import { createHtmlRenderState } from "./utils/create-render-state.js";

  export let props: MotionProps, visualState: ResolvedValues;

  const memo = (_visualState: typeof visualState) => {
    let state = createHtmlRenderState();

    buildHTMLStyles(state, _visualState, props.transformTemplate);

    const { vars, style } = state;
    return { ...vars, ...style };
  };
  $: styles = memo(visualState);
</script>

<slot {styles} />
