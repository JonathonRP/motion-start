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
    type LayoutEpoch,
  } from "../../../context/LayoutEpochContext.js";
  import Measure from "./Measure.svelte";

  export let visualElement, props, isCustom;

  $: ({ update } = props);

  // When snapshot=true AnimatePresence wants a full FLIP snapshot+flush cycle.
  // Pass epochUpdate only then so Measure re-renders → $: updater(update) →
  // afterUpdate(afterU) → syncLayout.flush().  The flush-only (snapshot=false)
  // path is handled directly inside Measure's layoutEpoch subscribe callback.
  const layoutEpoch = getContext<Writable<LayoutEpoch>>(LayoutEpochContext);
  $: epochUpdate = layoutEpoch && $layoutEpoch.snapshot ? $layoutEpoch.n : undefined;

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
