<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
  import type { RenderComponent } from "../../motion/features/types";
  import type { HTMLRenderState } from "../html/types";
  import type { SVGRenderState } from "../svg/types";
  import { filterProps } from "./utils/filter-props";
  import { isSVGComponent } from "./utils/is-svg-component";
  import { useSvgProps } from "../svg/use-props.svelte";
  import { useHTMLProps } from "../html/use-props.svelte";
  import { createAttachmentKey } from "svelte/attachments";
  import { untrack } from "svelte";
  import { noop } from "$lib/motion-start/utils/noop";

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

  const useVisualProps = $derived(
    isSVGComponent(Component) ? useSvgProps : useHTMLProps,
  );

  const visualProps = $derived(
    useVisualProps(
      () => props as any,
      () => visualState.latestValues,
      isStatic,
      Component,
    ),
  );

  const filteredProps = $derived(
    filterProps(() => props, typeof Component === "string", forwardMotionProps),
  );

  // TODO: attachments broke visualElement
  const motionRef = (node) => {
    // runs in effect.pre causes broken state, why?
    // $effect.pre(() => {
    if (typeof ref === "function") {
      ref(node);
    } else {
      (ref as any).current = node;
    }
    // });
  };

  const elementProps = $derived({
    ...filteredProps,
    ...visualProps,
    // [createAttachmentKey()]: motionRef,
  });
</script>

<svelte:element
  this={Component}
  {...elementProps}
  xmlns={isSVGComponent(Component) ? "http://www.w3.org/2000/svg" : undefined}
  use:motionRef
>
  {@render props.children?.()}
</svelte:element>
