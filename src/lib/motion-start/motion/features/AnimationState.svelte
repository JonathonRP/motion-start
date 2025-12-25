<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { tick } from "svelte";

  import { isAnimationControls } from "../../animation/utils/is-animation-controls.js";
  import { createAnimationState } from "../../render/utils/animation-state.js";

  let { visualElement, props }: {
    visualElement: any;
    props: any;
  } = $props();

  let { animate } = $derived(props);

  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  $effect(() => {
    visualElement.animationState =
      visualElement.animationState || createAnimationState(visualElement);
  });

  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  $effect(() => {
    if (isAnimationControls(animate)) {
      tick().then(() => animate.subscribe(visualElement) /*, [animate]*/);
    }
  });
</script>
