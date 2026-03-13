<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
  import { usePresence } from "../../../components/AnimatePresence/use-presence.js";
  import Animate from "./Animate.svelte";
  export let visualElement, props, isCustom;

  let { layout } = props;
  $: ({ layout } = props);
  const presence = usePresence(isCustom);
</script>

<Animate {visualElement} {layout} safeToRemove={$presence[1]} />
