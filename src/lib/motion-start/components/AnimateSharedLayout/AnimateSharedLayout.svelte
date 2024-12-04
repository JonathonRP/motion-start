<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { SharedLayoutContext } from "../../context/SharedLayoutContext.js";
  import { Presence, type SharedLayoutProps } from "./index.js";
  import { createBatcher } from "./utils/batcher.js";

  import { getContext, onMount, setContext, tick } from "svelte";
  import { get, writable, type Writable } from "svelte/store";
  import { setDomContext } from "../../context/DOMcontext.js";
  import {
    MotionContext,
    type MotionContextProps,
  } from "../../context/MotionContext/index.js";
  import { snapshotViewportBox } from "../../render/dom/projection/utils.js";
  import { resetRotate } from "./utils/rotate.js";
  import { layoutStack } from "./utils/stack.js";
  import PresenceChild from "../AnimatePresence/PresenceChild/PresenceChild.svelte";
  import type { VisualElement } from "$lib/motion-start/render/types.js";

  type $$Props = SharedLayoutProps;

  export let type: $$Props["type"] = undefined,
    isCustom = false;

  const context =
    getContext<Writable<MotionContextProps>>(MotionContext) ||
    MotionContext(isCustom);

  /**
   * Track whether the component has mounted. If it hasn't, the presence of added children
   * are set to Present, whereas if it has they're considered Entering
   */
  let hasMounted = false;
  /**
   * A list of all the children in the shared layout
   */
  let children = new Set<VisualElement>();
  /**
   * As animate components with a defined `layoutId` are added/removed to the tree,
   * we store them in order. When one is added, it will animate out from the
   * previous one, and when it's removed, it'll animate to the previous one.
   */
  let stacks = new Map();
  /**
   * Track whether we already have an update scheduled. If we don't, we'll run snapshots
   * and schedule one.
   */
  let updateScheduled = false;
  /**
   * Tracks whether we already have a render scheduled. If we don't, we'll force one with this.forceRender
   */
  let renderScheduled = false;

  let forced = false; /*
    const resetForced = ()=>{
        if (forced){
            forced=false;
        }
    }
    $: resetForced(forced);
    */
  /**
   * The methods provided to all children in the shared layout tree.
   */
  let syncContext = {
    ...createBatcher(),
    syncUpdate: (force?: boolean) => scheduleUpdate(force),
    forceUpdate: () => {
      // By copying syncContext to itself, when this component re-renders it'll also re-render
      // all children subscribed to the SharedLayout context.
      //syncContext = { ...syncContext }
      //scheduleUpdate(true)
      //syncContext = { ...syncContext }
      //setSyncContext()
      scheduleUpdate();

      forced = true;
    },
    register: (child: VisualElement) => addChild(child),
    remove: (child: VisualElement) => {
      removeChild(child);
    },
  };

  const startLayoutAnimation = () => {
    /**
     * Reset update and render scheduled status
     */
    renderScheduled = updateScheduled = false;

    /**
     * Update presence metadata based on the latest AnimatePresence status.
     * This is a kind of goofy way of dealing with this, perhaps there's a better model to find.
     */
    children.forEach((child) => {
      if (!child.isPresent) {
        child.presence = Presence.Exiting;
      } else if (child.presence !== Presence.Entering) {
        child.presence =
          child.presence === Presence.Exiting
            ? Presence.Entering
            : Presence.Present;
      }
    });

    updateStacks();

    /**
     * Create a handler which we can use to flush the children animations
     */
    const handler = {
      measureLayout: (child: any) => child.updateLayoutMeasurement(),
      layoutReady: (child: VisualElement) => {
        if (child.getLayoutId() !== undefined) {
          const stack = getStack(child);
          stack.animate(child, type === "crossfade");
        } else {
          child.notifyLayoutReady();
        }
      },
      parent: get(context).visualElement,
    };
    /**
     * Shared layout animations can be used without the AnimateSharedLayout wrapping component.
     * This requires some co-ordination across components to stop layout thrashing
     * and ensure measurements are taken at the correct time.
     *
     * Here we use that same mechanism of schedule/flush.
     */
    children.forEach((child) => syncContext.add(child));
    syncContext.flush(handler);

    /**
     * Clear snapshots so subsequent rerenders don't retain memory of outgoing components
     */
    stacks.forEach((stack) => stack.clearSnapshot());
  };

  const updateStacks = () => {
    stacks.forEach((stack) => stack.updateLeadAndFollow());
  };

  const scheduleUpdate = (force = false) => {
    if (!(force || !updateScheduled)) return;

    /**
     * Flag we've scheduled an update
     */
    updateScheduled = true;

    /**
     * Write: Reset rotation transforms so bounding boxes can be accurately measured.
     */
    children.forEach((child) => resetRotate(child));

    /**
     * Read: Snapshot children
     */
    children.forEach((child) => snapshotViewportBox(child));

    /**
     * Every child keeps a local snapshot, but we also want to record
     * snapshots of the visible children as, if they're are being removed
     * in this render, we can still access them.
     *
     * TODO: What would be better here is doing a single loop where we
     * only snapshotViewportBoxes of undefined layoutIds and then one for each stack
     */
    stacks.forEach((stack) => stack.updateSnapshot());

    /**
     * Force a rerender by setting state if we aren't already going to render.
     */
    if (force || !renderScheduled) {
      renderScheduled = true;
      forced = true;
    }
  };

  const addChild = (child: VisualElement) => {
    children.add(child);
    addToStack(child);

    child.presence = hasMounted ? Presence.Entering : Presence.Present;
  };

  const removeChild = (child: VisualElement) => {
    scheduleUpdate();
    children.delete(child);
    removeFromStack(child);
  };

  const addToStack = (child: VisualElement) => {
    const stack = getStack(child);
    stack?.add(child);
  };

  const removeFromStack = (child: VisualElement) => {
    const stack = getStack(child);
    stack?.remove(child);
  };

  /**
   * Return a stack of animate children based on the provided layoutId.
   * Will create a stack if none currently exists with that layoutId.
   */
  const getStack = (child: VisualElement) => {
    const id = child.getLayoutId();
    if (id === undefined) return;

    // Create stack if it doesn't already exist
    !stacks.has(id) && stacks.set(id, layoutStack());

    return stacks.get(id);
  };
  let sc = writable(syncContext);

  const setSyncContext = () => {
    syncContext = { ...syncContext };
    sc.set(syncContext);
    //forced = !forced
  };
  //$: sc.set(syncContext)
  setContext(SharedLayoutContext, sc);
  setDomContext("SharedLayout", isCustom, sc);

  onMount(() => {
    hasMounted = true;
  });

  //afterUpdate(()=>!forced && startLayoutAnimation())
  //const falseForced = ()=>{forced=false;return true;}
  //$: forced && renderScheduled && falseForced() && startLayoutAnimation()

  $: if (renderScheduled) {
    tick().then(() => {
      startLayoutAnimation();
    });
  }

  //afterUpdate(startLayoutAnimation)
</script>

<slot />
