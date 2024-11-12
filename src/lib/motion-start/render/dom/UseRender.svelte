<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { UseHTMLProps } from "../html/use-props.js";
  import { UseSVGProps } from "../svg/use-props.js";
  import { filterProps } from "./utils/filter-props.js";
  import { isSVGComponent } from "./utils/is-svg-component.js";

  export let props,
    visualState,
    Component: string,
    forwardMotionProps = false,
    ref,
    targetEl = undefined;

  const motion = (node: any) => {
    Component = node.tagName;
    ref(node);
  };
  $: filteredProps = filterProps(
    props,
    typeof Component === "string",
    forwardMotionProps,
  );
  $: if (targetEl) {
    motion(targetEl);
  }
</script>

<svelte:component
  this={isSVGComponent(Component) ? UseSVGProps : UseHTMLProps}
  {visualState}
  {props}
  {Component}
  let:visualProps
>
  <slot {motion} props={{ ...filteredProps, ...visualProps }} />
</svelte:component>
