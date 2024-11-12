<!-- <svelte:options runes={true}/> -->
<script lang="ts">
  import type { SvelteHTMLElements } from "svelte/elements";
  import type { Snippet } from "svelte";
  import type { MotionProps } from "../../motion";
  import Motion from "../components/motion/Motion.svelte";

  let {
    as,
    isSVG,
    class: className,
    children,
    ...restProps
  }: {
    as: keyof SvelteHTMLElements;
    children: Snippet;
    class: string;
  } & MotionProps = $props();
</script>

<Motion {...restProps} let:props let:motion {isSVG}>
  <svelte:element
    this={as}
    {...Object.fromEntries(
      Object.entries(props).filter(
        ([key, _]) =>
          key !== "latestvalues" &&
          key !== "renderstate" &&
          key !== "visualProps",
      ),
    )}
    bind:this={props.ref}
    class={props.class}
    xmlns={isSVG ? "http://www.w3.org/2000/svg" : undefined}
    use:motion
  >
    {@render children()}
  </svelte:element>
</Motion>
