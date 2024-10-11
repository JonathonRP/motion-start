<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import UseStyle from "./UseStyle.svelte";

  export let props, visualState, isStatic;

  const getHTMLProps = (style: { userSelect?: any; WebkitUserSelect?: any; WebkitTouchCallout?: any; touchAction?: any; }, props: { drag: string | boolean; }) => {
    interface HTMLProps {
      draggable:boolean
      style: {
          userSelect?: any;
          WebkitUserSelect?: any;
          WebkitTouchCallout?: any;
          touchAction?: any;
      }
    }
    let htmlProps: HTMLProps = { 
          draggable: false,
          style: { 
            userSelect: undefined,
            WebkitUserSelect: undefined,
            WebkitTouchCallout: undefined,
            touchAction: undefined,
          }
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
</script>

<UseStyle let:styles {visualState} {props} {isStatic}>
  <slot visualProps={getHTMLProps(styles, props)} />
</UseStyle>
