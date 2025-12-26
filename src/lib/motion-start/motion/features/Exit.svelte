<!-- based on framer-motion@11.11.11,
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
    PRESENCE_CONTEXT_KEY,
    type PresenceContextProps,
  } from "../../context/PresenceContext.js";
  import { AnimationType } from "../../render/utils/types.js";

  let { props, visualElement, isCustom, children } = $props();
  const { custom } = $derived(props);

  const presenceContext = $derived(
    getContext<PresenceContextProps | null>(PRESENCE_CONTEXT_KEY) ||
      PresenceContext(isCustom),
  );
  const presence = $derived(usePresence(isCustom));

  const _effect = (pres: AlwaysPresent | Present | NotPresent) => {
    const [isPresent, onExitComplete] = pres;

    const animation = visualElement.animationState?.setActive(
      AnimationType.Exit,
      !isPresent,
      { custom: presenceContext?.custom ?? custom },
    );

    !isPresent && animation?.then(onExitComplete);
  };
  $effect(() => _effect(presence));
</script>

{@render children?.()}
