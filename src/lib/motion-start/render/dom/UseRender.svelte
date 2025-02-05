<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
  import type { RenderComponent } from "../../motion/features/types";
  import type { HTMLRenderState } from "../html/types";
  import type { SVGRenderState } from "../svg/types";
  import { filterProps } from "./utils/filter-props";
  import { isSVGComponent } from "./utils/is-svg-component";
  import { useSvgProps } from "../svg/use-props";
  import { useHTMLProps } from "../html/use-props";

  type Props = Parameters<
    RenderComponent<HTMLElement | SVGElement, HTMLRenderState | SVGRenderState>
  >[1] & {
    forwardMotionProps: boolean;
  };

  let {
    Component,
    props,
    ref,
    visualState,
    isStatic,
    forwardMotionProps,
  }: Props = $props();

  // $inspect(props);
  const { latestValues } = $derived(visualState);
  const { children } = $derived(props);
  const useVisualProps = $derived(
    isSVGComponent(Component) ? useSvgProps : useHTMLProps,
  );

  const visualProps = $derived({
    ...useVisualProps(props as any, latestValues, isStatic, Component),
  });

  const filteredProps = $derived(
    filterProps(props, typeof Component === "string", forwardMotionProps),
  );

  const elementProps = $derived({ ...filteredProps, ...visualProps, ref });

  const motion = $derived((node: HTMLElement | SVGElement | null) => {
    if (typeof ref === "function") {
      ref(node);
    } else {
      (ref as any).current = node;
    }
  });

  // $inspect(el);
</script>

<svelte:element
  this={Component}
  {...elementProps}
  use:motion
  xmlns={isSVGComponent(Component) ? "http://www.w3.org/2000/svg" : undefined}
>
  {@render children?.()}
</svelte:element>
