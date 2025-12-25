<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { getContext } from "svelte";
  import {
    LayoutGroupContext,
    LAYOUT_GROUP_CONTEXT_KEY,
  } from "../../context/LayoutGroupContext.js";

  let { props, isCustom }: {
    props: any;
    isCustom: any;
  } = $props();

  let { layoutId } = $derived(props);

  const layoutGroupId =
    getContext<string | null>(LAYOUT_GROUP_CONTEXT_KEY) ||
    LayoutGroupContext(isCustom);
</script>

<slot
  layoutId={layoutGroupId && layoutId !== undefined
    ? layoutGroupId + "-" + layoutId
    : layoutId}
/>
