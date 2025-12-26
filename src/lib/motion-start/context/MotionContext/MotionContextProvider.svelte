<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { setContext } from "svelte";
  import { setDomContext } from "../DOMcontext.js";
  import { MOTION_CONTEXT_KEY, type MotionContextProps } from "./index.js";

  let { value, isCustom } = $props<{
    value: MotionContextProps;
    isCustom?: boolean;
  }>();

  // Use $state for reactive context value
  let contextValue = $state<MotionContextProps>(value);

  $effect(() => {
    // Mutate the object properties for reactivity
    Object.assign(contextValue, value);
  });

  // Set reactive context using the symbol key
  setContext(MOTION_CONTEXT_KEY, contextValue);
  setDomContext("Motion", isCustom, contextValue);

  // Since useMotionRef is not called on destroy, the visual element is unmounted here
  $effect(() => {
    return () => {
      contextValue?.visualElement?.unmount();
    };
  });
</script>

<slot />
