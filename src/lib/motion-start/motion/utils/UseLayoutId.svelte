<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import { LayoutGroupContext } from "../../context/LayoutGroupContext.js";
  export let props, isCustom;
  $: ({ layoutId } = props);
  const layoutGroupId =
    getContext<Writable<string | null>>(LayoutGroupContext) ||
    LayoutGroupContext(isCustom);
</script>

<slot
  layoutId={$layoutGroupId && layoutId !== undefined
    ? $layoutGroupId + "-" + layoutId
    : layoutId}
/>
