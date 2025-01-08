<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
  import { getContext } from "svelte";
  import type { RenderComponent } from "../../motion/features/types";
  import type { HTMLRenderState } from "../html/types";
  import type { SVGRenderState } from "../svg/types";
  import { filterProps } from "./utils/filter-props";
  import { isSVGComponent } from "./utils/is-svg-component";
  import { useSvgProps } from "../svg/use-props";
  import { useHTMLProps } from "../html/use-props";

  type Props = Parameters<
    RenderComponent<HTMLElement | SVGElement, HTMLRenderState | SVGRenderState>
  >[1];

  let { Component, props, visualState, isStatic, children }: Props = $props();

  // $inspect(props);

  const { latestValues } = $derived(visualState);
  const useVisualProps = $derived(
    isSVGComponent(Component) ? useSvgProps : useHTMLProps,
  );

  const visualProps = $derived({
    ...useVisualProps(props as any, latestValues, isStatic, Component),
  });

  const filteredProps = $derived(
    filterProps(
      props,
      typeof Component === "string",
      getContext("forwardMotionProps"),
    ),
  );

  const elementProps = $derived({ ...filteredProps, ...visualProps });

  // $inspect(el);
  // $: typeof ref === "function" ? ref(element) : (ref!.current = element);
</script>

{@render children?.({ elementProps })}
