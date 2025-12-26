<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<script lang="ts">
  import { getContext } from "svelte";
  import { MOTION_CONTEXT_KEY, MotionContext, type MotionContextProps } from "./index.js";

  let { isCustom } = $props();

  const motionContext =
    getContext<MotionContextProps>(MOTION_CONTEXT_KEY) ||
    MotionContext(isCustom);
</script>

<slot parent={motionContext.visualElement} />
