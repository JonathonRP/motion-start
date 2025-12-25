<svelte:options runes={true}/>
<script lang="ts">
  import type { SvelteHTMLElements } from "svelte/elements";
  import type { MotionProps } from "../../motion";
  import Motion from "../../motion/Motion.svelte";

  let {
    ___tag,
    el = $bindable(),
    isSVG = false,
    ...restProps
  }: {
    ___tag: keyof SvelteHTMLElements;
    el?: SvelteHTMLElements[typeof ___tag]["this"];
    isSVG?: boolean;
  } & MotionProps = $props();
</script>

<Motion {...restProps} let:props let:motion {isSVG}>
  <svelte:element
    this={___tag}
    {...Object.fromEntries(
      Object.entries(props).filter(
        ([key, _]) =>
          key !== "latestvalues" &&
          key !== "renderstate" &&
          key !== "visualProps"
      )
    )}
    bind:this={el}
    class={props.class}
    xmlns={isSVG ? "http://www.w3.org/2000/svg" : undefined}
    use:motion
  >
    <slot />
  </svelte:element>
</Motion>
