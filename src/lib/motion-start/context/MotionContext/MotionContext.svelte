<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->
<script lang="ts">
  import { getContext } from "svelte";
  import { type Writable } from "svelte/store";
  import { MotionContext, type MotionContextProps } from "./index.js";
  export let isCustom;
  const motionContext =
    getContext<Writable<MotionContextProps>>(MotionContext) ||
    MotionContext(isCustom);
</script>

<slot parent={$motionContext.visualElement} />
