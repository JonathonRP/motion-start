<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { UseDomEvent } from "../events/use-dom-event.js";
  import { AnimationType } from "../render/utils/types.js";

  export let props, visualElement;
  $: ({ whileFocus } = props);
  const onFocus = () => {
    visualElement.animationState?.setActive(AnimationType.Focus, true);
  };

  const onBlur = () => {
    visualElement.animationState?.setActive(AnimationType.Focus, false);
  };
</script>

<UseDomEvent
  ref={visualElement}
  eventName="focus"
  handler={whileFocus ? onFocus : undefined}
>
  <UseDomEvent
    ref={visualElement}
    eventName="blur"
    handler={whileFocus ? onBlur : undefined}
  >
    <slot />
  </UseDomEvent>
</UseDomEvent>
