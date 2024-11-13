<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts" context="module" module>
  import type { MotionProps } from "../../motion/types.js";
  import type { ResolvedValues } from "../types.js";
  import { copyRawValuesOnly } from "./use-props.js";
</script>

<script lang="ts">
  import UseInitialMotionValues from "./UseInitialMotionValues.svelte";

  export let props: MotionProps, visualState: ResolvedValues;
  $: styleProp = props.style || {};
  let style = {};
  /**
   * Copy non-Motion Values straight into style
   */
  const cRVO = copyRawValuesOnly;
  $: cRVO(style, styleProp as any, props);
</script>

<UseInitialMotionValues {props} {visualState} let:styles={motionStyles}>
  <slot style={Object.assign(style, motionStyles)} />
</UseInitialMotionValues>
