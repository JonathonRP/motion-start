<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts" module>
  let presenceId = 0;
  function getPresenceId() {
    const id = presenceId;
    presenceId++;
    return id;
  }
  function newChildrenMap(): Map<number, boolean> {
    return new Map<number, boolean>();
  }
</script>

<script lang="ts">
  import { setContext, tick, untrack } from "svelte";
  import { setDomContext } from "../../../context/DOMcontext.js";
  import { PresenceContext, type PresenceTuple } from "../../../context/PresenceContext.js";
  import type { PresenceChildProps } from "./index.js";

  interface Props extends PresenceChildProps {}

  let {
    isPresent,
    onExitComplete = undefined,
    initial = undefined,
    custom = undefined,
    presenceAffectsLayout,
    isCustom,
    children,
    presenceKey = undefined,
  }: Props = $props();

  const presenceChildren = newChildrenMap();
  const id = getPresenceId();

  const refresh = $derived(presenceAffectsLayout ? undefined : isPresent);

  const memoContext = (flag?: boolean) => {
    function handleOnExitComplete(childId: number) {
      if (!presenceChildren.has(childId)) return;
      if (presenceChildren.get(childId) === true) return;
      presenceChildren.set(childId, true);
      let allComplete = true;
      presenceChildren.forEach((isComplete) => {
        if (!isComplete) allComplete = false;
      });
      allComplete && onExitComplete?.();
    }

    return {
      id,
      presenceKey,
      initial,
      isPresent,
      custom,
      onExitComplete: handleOnExitComplete,
      register: (childId: number) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      },

      /** Returns presenceId and blockInitialAnimation for visual element creation. */
      getInitialOptions() {
        return {
          presenceId: id,
          blockInitialAnimation: initial === false,
        };
      },

      /** True when the visual element is the root of this presence group. */
      isPresenceRoot(parentPresenceId?: number) {
        return parentPresenceId === undefined || parentPresenceId !== id;
      },

      /** Returns custom data for exit animations, falling back to the provided value. */
      getCustomData(fallback?: any) {
        return custom ?? fallback;
      },

      /** Returns the [isPresent, safeToRemove?] tuple for a registered child id. */
      getPresenceTuple(childId: number): PresenceTuple {
        if (!isPresent) {
          return [false, () => handleOnExitComplete(childId)];
        }
        return [true];
      },
    };
  };
  let context = PresenceContext();
  // Set synchronously so children's usePresence() sees a non-null value via get()
  context.set(memoContext());

  // Update context when relevant props change
  $effect(() => {
    if (presenceAffectsLayout) {
      // Track all relevant props
      isPresent;
      initial;
      custom;
      // But set context without tracking to avoid loops
      untrack(() => context.set(memoContext()));
    } else {
      // When presenceAffectsLayout is false, only track isPresent via refresh
      refresh;
      untrack(() => context.set(memoContext()));
    }
  });

  const keyset = (flag?: boolean) => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  };
  $effect(() => {
    keyset(isPresent);
    tick().then(() => {
      !isPresent && !presenceChildren.size && onExitComplete?.();
    });
  });
  setContext(PresenceContext, context);
  setDomContext("Presence", isCustom, context);
</script>

{@render children?.()}
