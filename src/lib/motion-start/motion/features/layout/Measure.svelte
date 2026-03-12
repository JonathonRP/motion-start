<!-- based on framer-motion@4.1.16,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { afterUpdate, beforeUpdate, getContext, onDestroy, onMount } from "svelte";
  import { get, type Writable } from "svelte/store";
  import {
    ScaleCorrectionContext,
    ScaleCorrectionParentContext,
  } from "../../../context/ScaleCorrectionProvider.svelte";
  import { isSharedLayout } from "../../../context/SharedLayoutContext.js";
  import { snapshotViewportBox } from "../../../render/dom/projection/utils.js";
  import { LayoutEpochContext } from "../../../context/LayoutEpochContext.js";

  export let visualElement, syncLayout, framerSyncLayout, update;

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
  /**
   * If this is a child of a SyncContext, notify it that it needs to re-render. It will then
   * handle the snapshotting.
   *
   * If it is stand-alone component, add it to the batcher.
   */

  let updated = false;
  const updater = (nc = false) => {
    if (updated) {
      return null;
    }
    updated = true;

    // in React the updater function is called on children first, in Svelte the child does not call it.
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

  $: update !== undefined && updater(update);

  if (update === undefined) {
    beforeUpdate(updater);
  }

  const afterU = (nc = false) => {
    updated = false;
    /* Second part of the updater calling in child layouts first.*/
    const scc = get(scaleCorrectionContext);

    scc.forEach((v: any, i) => {
      v.afterU?.(true);
    });

    if (!isSharedLayout(syncLayout)) {
      syncLayout.flush();
    }

    /**
     * If this axis isn't animating as a result of this render we want to reset the targetBox
     * to the measured box
     */
    //setCurrentViewportBox(visualElement);
  };

  // Subscribe to LayoutEpochContext so AnimatePresence's forceRender() triggers a
  // synchronous snapshot (store.update fires subscribers before the DOM changes)
  // and MeasureContextProvider's reactive $: triggers afterU after DOM settles.
  const layoutEpoch = getContext<Writable<number>>(LayoutEpochContext);
  if (layoutEpoch) {
    let ready = false;
    const unsub = layoutEpoch.subscribe(() => {
      if (!ready) { ready = true; return; } // skip initial call at subscribe time
      updater();
    });
    onDestroy(unsub);
  }

  scaleCorrectionParentContext.update((v) =>
    v.concat([
      {
        updater,
        afterU,
      },
    ]),
  );
  afterUpdate(afterU);
</script>
