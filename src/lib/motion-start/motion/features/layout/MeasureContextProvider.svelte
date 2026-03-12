<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import type {
    SharedLayoutSyncMethods,
    SyncLayoutBatcher,
  } from "../../../components/AnimateSharedLayout/types.js";
  import {
    FramerTreeLayoutContext,
    SharedLayoutContext,
  } from "../../../context/SharedLayoutContext.js";
  import {
    LayoutEpochContext,
  } from "../../../context/LayoutEpochContext.js";
  import Measure from "./Measure.svelte";

  export let visualElement, props, isCustom;

  $: ({ update } = props);

  // Increment from AnimatePresence drives afterU flush via $: reactive statement in Measure.
  const layoutEpoch = getContext<Writable<number>>(LayoutEpochContext);
  $: epochUpdate = layoutEpoch ? $layoutEpoch : undefined;

  const syncLayout =
    getContext<Writable<SyncLayoutBatcher | SharedLayoutSyncMethods>>(
      SharedLayoutContext,
    ) || SharedLayoutContext(isCustom);

  const framerSyncLayout =
    getContext<Writable<SyncLayoutBatcher>>(FramerTreeLayoutContext) ||
    FramerTreeLayoutContext(isCustom);
</script>

<Measure
  syncLayout={$syncLayout}
  framerSyncLayout={$framerSyncLayout}
  {visualElement}
  update={update ?? epochUpdate}
/>
