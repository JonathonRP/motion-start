<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
  import { copyRawValuesOnly } from "./use-props.js";
  import { buildHTMLStyles } from "./utils/build-styles.js";
  import { createHtmlRenderState } from "./utils/create-render-state.js";
  import type { HTMLProps } from "./types";

  let { visualState, props, isStatic, children } = $props();

  const getHTMLProps = (
    style: HTMLProps["style"],
    props: { drag: string | boolean },
  ) => {
    let htmlProps: HTMLProps = {
      draggable: false,
      style: {
        userSelect: undefined,
        WebkitUserSelect: undefined,
        WebkitTouchCallout: undefined,
        touchAction: undefined,
      },
    };
    if (Boolean(props.drag)) {
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

    htmlProps.style = style;
    return htmlProps;
  };

  const memo = (variantLabelsAsDependency?: string | boolean | undefined) => {
    let state = createHtmlRenderState();

    buildHTMLStyles(
      state,
      visualState,
      undefined,
      undefined,
      { enableHardwareAcceleration: !isStatic },
      props.transformTemplate,
    );

    const { vars, style } = state;
    const mergedStyle: Record<string, any> = { ...vars, ...style };

    if (props.style) {
      const rawStyles: Record<string, any> = {};
      copyRawValuesOnly(rawStyles, props.style, props);
      Object.assign(mergedStyle, rawStyles);
    }

    if (props.transformValues) {
      return getHTMLProps(props.transformValues(mergedStyle), props);
    }

    return getHTMLProps(mergedStyle, props);
  };

  const visualProps = $derived(memo(visualState));
</script>

{@render children?.(visualProps)}
