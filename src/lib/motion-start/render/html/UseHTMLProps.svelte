<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import type { MotionProps } from "$lib/motion-start/motion";
  import type { HTMLAttributes } from "svelte/elements";
  import UseStyle from "./UseStyle.svelte";
  import type { ResolvedValues } from "../types";

  export let props: MotionProps & HTMLAttributes<HTMLElement>,
    visualState: ResolvedValues;

  const getHTMLProps = (style: any, props: any) => {
    const htmlProps: any = {};
    if (props.drag && props.dragListener !== false) {
      // Disable the ghost element when a user drags
      htmlProps.draggable = false;

      // Disable text selection
      style.userSelect =
        style.WebkitUserSelect =
        style.WebkitTouchCallout =
          "none";

      // Disable scrolling on the draggable direction
      style.touchAction =
        props.drag === true ? "none" : `pan-${props.drag === "x" ? "y" : "x"}`;
    }

    if (
      props.tabIndex === undefined &&
      (props.onTap || props.onTapStart || props.whileTap)
    ) {
      htmlProps.tabIndex = 0;
    }

    htmlProps.style = style;
    return htmlProps;
  };
</script>

<UseStyle let:style {visualState} {props}>
  <slot visualProps={getHTMLProps(style, props)} />
</UseStyle>
