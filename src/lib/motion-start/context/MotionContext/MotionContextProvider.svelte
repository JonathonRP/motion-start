<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import { setDomContext } from "../DOMcontext.js";
  import { MotionContext } from "./index.js";

  let { value, isCustom } = $props();
  let store = writable(value);

  $effect(() => {
    store.set(value);
  });

  setContext(MotionContext, store);
  setDomContext("Motion", isCustom, store);

  // Since useMotionRef is not called on destroy, the visual element is unmounted here
  $effect(() => {
    return () => {
      value?.visualElement?.unmount();
    };
  });
</script>

<slot />
