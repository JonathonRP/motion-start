<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { isMotionValue } from "../../../value/utils/is-motion-value.js";
  import type { VisualElement } from "../../types";

  type $$Props = {
    visualElement: VisualElement;
    props: any;
  };

  export let visualElement: $$Props["visualElement"], props: $$Props["props"];

  const createAttrs = (
    visualElement: $$Props["visualElement"],
    props: $$Props["props"],
  ) => {
    const { attrs } = visualElement.build();
    const resolvedMotionValueProps = {} as any;

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
