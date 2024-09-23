<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { isMotionValue } from "../../../value/utils/is-motion-value.js";

  export let visualElement, props;
  const createAttrs = (visualElement, props) => {
    const { attrs } = visualElement.build();
    const resolvedMotionValueProps = {};

    for (const key in props) {
      if (isMotionValue(props[key])) {
        resolvedMotionValueProps[key] = props[key].get();
      }
    }

    return { ...attrs, ...resolvedMotionValueProps };
  };
  let svgProps = createAttrs(visualElement, props);
  $: if (visualElement.isStatic) {
    svgProps = createAttrs(visualElement, props);
  }
</script>

<slot {svgProps} />
