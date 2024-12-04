<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts" context="module">
  import { copyRawValuesOnly } from "./use-props.js";
</script>

<script lang="ts">
  import UseInitialMotionValues from "./UseInitialMotionValues.svelte";

  export let visualState, props, isStatic;
  $: styleProp = props.style || {};
  let style = {};
  /**
   * Copy non-Motion Values straight into style
   */
  const cRVO = copyRawValuesOnly;
  $: cRVO(style, styleProp, props);

  const toStyle = (s1: { s1: {}; props: any; style: {} }) => {
    Object.assign(style, s1);
    if (props.transformValues) {
      style = props.transformValues(style);
    }

    return style;
  };
</script>

<UseInitialMotionValues {props} {visualState} {isStatic}>
  {#snippet children(s1: any)}
    <slot styles={toStyle({ s1, props, style })} />
  {/snippet}
</UseInitialMotionValues>
