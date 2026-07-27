<svelte:options runes={false} />

<script>
  import Box from "../Box.svelte";
  import RefreshButton from "../RefreshButton.svelte";
  // import { Motion } from "svelte-motion"
  import { motion } from "$lib/motion-start";
  let i = 0;
</script>

<Box cls="flex-col gap-10">
  {#key i}
    <motion.div
      id="tweenedbox"
      animate={{
        rotate: 360,
      }}
      transition={{
        duration: 2,
      }}
      class="box"
    ></motion.div>
  {/key}
  <div>
    <RefreshButton
      id="tweenbtn"
      onclick={() => {
        i++;
      }}
    />
  </div>
</Box>
