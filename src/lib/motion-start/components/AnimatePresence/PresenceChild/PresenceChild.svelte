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
  import { PresenceContext } from "../../../context/PresenceContext.js";
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
  }: Props = $props();

  const presenceChildren = newChildrenMap();
  const id = getPresenceId();

  const memoContext = (flag?: boolean) => {
    return {
      id,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId: number) => {
        if (!presenceChildren.has(childId)) return;
        if (presenceChildren.get(childId) === true) return;
        presenceChildren.set(childId, true);
        let allComplete = true;
        presenceChildren.forEach((isComplete) => {
          if (!isComplete) allComplete = false;
        });

        allComplete && onExitComplete?.();
      },
      register: (childId: number) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      },
    };
  };
  let context = PresenceContext();
  // Set synchronously so children's usePresence() sees a non-null value via get()
  context.set(memoContext());

  // Update context when relevant props change.
  // Explicitly assign to consts so Svelte 5 reliably tracks each reactive read.
  $effect(() => {
    const _isPresent = isPresent;
    // When presenceAffectsLayout is true also track initial/custom so layout
    // animations see up-to-date values immediately.
    const _initial = presenceAffectsLayout ? initial : null;
    const _custom = presenceAffectsLayout ? custom : null;
    void _isPresent; void _initial; void _custom;
    untrack(() => context.set(memoContext()));
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
