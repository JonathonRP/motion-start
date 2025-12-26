<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { isMotionValue } from "../../../value/utils/is-motion-value.js";
  import type { VisualElement } from "../../types";

  type $$Props = {
    visualElement: VisualElement;
    props: any;
    children?: Snippet<[{ svgProps: any }]>;
  };

  let { visualElement, props, children }: $$Props = $props();

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

  let svgProps = $state(createAttrs(visualElement, props));

  $effect(() => {
    if (visualElement.isStatic) {
      svgProps = createAttrs(visualElement, props);
    }
  });
</script>

{@render children?.({ svgProps })}
