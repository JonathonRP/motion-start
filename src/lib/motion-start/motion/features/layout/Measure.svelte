<!-- based on framer-motion@4.1.16,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
  import { getContext, onDestroy, onMount } from "svelte";
  import { get, type Writable } from "svelte/store";
  import {
    ScaleCorrectionContext,
    ScaleCorrectionParentContext,
  } from "../../../context/ScaleCorrectionProvider.svelte";
  import { isSharedLayout } from "../../../context/SharedLayoutContext.js";
  import { snapshotViewportBox } from "../../../render/dom/projection/utils.js";
  import { LayoutSnapshotContext } from "../../../context/LayoutSnapshotContext.js";

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

  // Register updater in the synchronous snapshot registry provided by the
  // nearest AnimatePresence ancestor.  AnimatePresence calls all registered
  // callbacks inside its Svelte 4 reactive block — before childrenToRender (and
  // therefore the DOM) changes — so we snapshot the correct "from" position for
  // FLIP.  The `updated` guard in updater() prevents double-execution if
  // $effect.pre also fires for the non-AnimatePresence case.
  const snapshotCallbacks = getContext<Set<() => void>>(LayoutSnapshotContext);
  if (snapshotCallbacks) {
    snapshotCallbacks.add(updater);
    onDestroy(() => snapshotCallbacks.delete(updater));
  }

  // Fallback: for layout animations not driven by AnimatePresence (standalone
  // `layout` prop), $effect.pre fires before the Svelte 5 component's own DOM
  // update and provides the snapshot.  It is a no-op when the synchronous
  // callback already ran (updated guard).
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
