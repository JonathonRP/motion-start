<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { usePresence } from "../../../components/AnimatePresence/use-presence.js";
  import Animate from "./Animate.svelte";

  let { visualElement, props, isCustom }: {
    visualElement: any;
    props: any;
    isCustom: any;
  } = $props();

  let { layout } = $derived(props);
  const presence = usePresence(isCustom);
</script>

<Animate {visualElement} {layout} safeToRemove={$presence[1]} />
