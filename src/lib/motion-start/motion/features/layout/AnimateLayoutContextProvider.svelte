<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { getContext, onDestroy } from "svelte";
  import { get } from "svelte/store";
  import { usePresence } from "../../../components/AnimatePresence/use-presence.js";
  import { PresenceContext } from "../../../context/PresenceContext.js";
  import { LayoutPositionContext } from "../../../context/LayoutPositionContext.js";
  import Animate from "./Animate.svelte";
  export let visualElement, props, isCustom;

  let { layout } = props;
  $: ({ layout } = props);
  const presence = usePresence(isCustom);

  // Register an applyAbsolute callback with AnimatePresence's position registry
  // so that when presenceAffectsLayout=true, the exiting element is removed from
  // layout flow synchronously (after snapshot, before FLIP measurement).
  const positionRegistry = getContext<Map<any, () => void>>(LayoutPositionContext);
  if (positionRegistry) {
    const presCtxStore = getContext(PresenceContext) || PresenceContext(isCustom);
    const presCtx = get(presCtxStore);
    const presKey = presCtx?.presenceKey;
    if (presKey !== undefined) {
      const applyAbsolute = () => {
        const el = visualElement.getInstance() as HTMLElement | null;
        if (!el) return;
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const t = el.offsetTop;
        const l = el.offsetLeft;
        el.style.position = "absolute";
        el.style.top = `${t}px`;
        el.style.left = `${l}px`;
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.style.pointerEvents = "none";
      };
      positionRegistry.set(presKey, applyAbsolute);
      onDestroy(() => positionRegistry.delete(presKey));
    }
  }
</script>

<Animate {visualElement} {layout} safeToRemove={$presence[1]} />
