<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

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

  export let props, visualElement, isCustom;
  $: ({ custom } = props);

  const presenceContext =
    getContext<Writable<PresenceContextProps>>(PresenceContext) ||
    PresenceContext(isCustom);
  const presence = usePresence(isCustom);

  const effect = (pres: AlwaysPresent | Present | NotPresent) => {
    const [isPresent, onExitComplete] = pres;

    const animation = visualElement.animationState?.setActive(
      AnimationType.Exit,
      !isPresent,
      { custom: $presenceContext?.custom ?? custom },
    );

    !isPresent && animation?.then(onExitComplete);
    return "";
  };
  $: effect($presence);
</script>

<slot />
