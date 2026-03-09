<!-- based on framer-motion@4.1.16,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { get, type Writable } from "svelte/store";
  import {
    ScaleCorrectionContext,
    ScaleCorrectionParentContext,
  } from "../../../context/ScaleCorrectionProvider.svelte";
  import { isSharedLayout } from "../../../context/SharedLayoutContext.js";
  import { snapshotViewportBox } from "../../../render/dom/projection/utils.js";

  let { visualElement, syncLayout, framerSyncLayout, update } = $props();

  const scaleCorrectionContext = getContext<Writable<any[]>>(
    ScaleCorrectionContext,
  );
  const scaleCorrectionParentContext = getContext<Writable<any[]>>(
    ScaleCorrectionParentContext,
  );

  onMount(() => {
    isSharedLayout(syncLayout) && syncLayout.register(visualElement);
    isSharedLayout(framerSyncLayout) &&
      framerSyncLayout.register(visualElement);

    visualElement.onUnmount(() => {
      if (isSharedLayout(syncLayout)) {
        syncLayout.remove(visualElement);
      }

      if (isSharedLayout(framerSyncLayout)) {
        framerSyncLayout.remove(visualElement);
      }
    });
  });
  let updated = false;

  const updater = (nc = false) => {
    if (updated) return null;
    updated = true;

    get(scaleCorrectionContext).forEach((v) => {
      v.updater?.(true);
    });

    if (isSharedLayout(syncLayout)) {
      syncLayout.syncUpdate();
    } else {
      snapshotViewportBox(visualElement, nc);
      syncLayout.add(visualElement);
    }

    return null;
  };

  const afterU = (nc = false) => {
    updated = false;
    const scc = get(scaleCorrectionContext);
    scc.forEach((v: any) => { v.afterU?.(true); });

    if (!isSharedLayout(syncLayout)) {
      syncLayout.flush();
    }
  };

  // $effect.pre fires BEFORE the DOM is updated.  Reading `update` here means
  // we re-snapshot whenever AnimatePresence increments the layout epoch, while
  // the old layout is still intact — giving us the FLIP "from" position.
  $effect.pre(() => {
    const _u = update; void _u;
    updater();
  });

  // $effect fires AFTER DOM updates — flush the batcher to measure new
  // positions and kick off the FLIP animations.
  $effect(() => {
    const _u = update; void _u;
    afterU();
  });

  scaleCorrectionParentContext.update((v) =>
    v.concat([{ updater, afterU }]),
  );
</script>
