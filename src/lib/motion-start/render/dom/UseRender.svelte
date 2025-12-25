<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { UseHTMLProps } from "../html/use-props.js";
  import { UseSVGProps } from "../svg/use-props.js";
  import { filterProps } from "./utils/filter-props.js";

  let {
    props,
    visualState,
    Component,
    forwardMotionProps = false,
    isStatic,
    ref,
    targetEl = undefined
  }: {
    props: any;
    visualState: any;
    Component: any;
    forwardMotionProps?: boolean;
    isStatic: any;
    ref: any;
    targetEl?: any;
  } = $props();

  const motion = (node: any) => {
    ref(node);
  };

  let filteredProps = $derived(
    filterProps(
      props,
      typeof Component === "string",
      forwardMotionProps,
    )
  );

  $effect(() => {
    if (targetEl) {
      motion(targetEl);
    }
  });
</script>

<svelte:component
  this={Component === "SVG" ? UseSVGProps : UseHTMLProps}
  {visualState}
  {isStatic}
  {props}
>
  {#snippet children(visualProps: any)}
    <slot {motion} props={{ ...filteredProps, ...visualProps }} />
  {/snippet}
</svelte:component>
