<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { UseHTMLProps } from "../html/use-props.js";
  import { UseSVGProps } from "../svg/use-props.js";
  import { filterProps } from "./utils/filter-props.js";

  export let props,
    visualState,
    Component,
    forwardMotionProps = false,
    isStatic,
    ref,
    targetEl = undefined;
  const motion = (node) => {
    ref(node);
  };
  $: filteredProps = filterProps(
    props,
    typeof Component === "string",
    forwardMotionProps
  );
  $: if (targetEl) {
    motion(targetEl);
  }
</script>

<svelte:component
  this={Component === "SVG" ? UseSVGProps : UseHTMLProps}
  {visualState}
  {isStatic}
  {props}
  let:visualProps
>
  <slot {motion} props={{ ...filteredProps, ...visualProps }} />
</svelte:component>
