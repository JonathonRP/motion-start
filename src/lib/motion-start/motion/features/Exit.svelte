<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
  import { getContext } from "svelte";
  import {
    usePresence,
    type AlwaysPresent,
    type NotPresent,
    type Present,
  } from "../../components/AnimatePresence/use-presence.js";
  import {
    PresenceContext,
    type PresenceContextProps,
  } from "../../context/PresenceContext.js";
  import { AnimationType } from "../../render/utils/types.js";
  import type { Writable } from "svelte/store";

  let { props, visualElement, isCustom, children } = $props();
  const { custom } = $derived(props);

  const presenceContext = $derived(
    getContext<Writable<PresenceContextProps>>(PresenceContext) ||
      PresenceContext(isCustom),
  );
  const presence = $derived(usePresence(isCustom));

  const _effect = (pres: AlwaysPresent | Present | NotPresent) => {
    const [isPresent, onExitComplete] = pres;

    const animation = visualElement.animationState?.setActive(
      AnimationType.Exit,
      !isPresent,
      { custom: $presenceContext?.custom ?? custom },
    );

    !isPresent && animation?.then(onExitComplete);
  };
  $effect(() => _effect($presence));
</script>

{@render children?.()}
