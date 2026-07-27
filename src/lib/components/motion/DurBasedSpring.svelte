<svelte:options runes={false} />

<script>
  import Box from "../Box.svelte";
  import RefreshButton from "../RefreshButton.svelte";
  import { motion } from "$lib/motion-start";
  let i = 0;
</script>

<Box cls="flex-col gap-20">
  {#key i}
    <motion.div
      animate={{
        rotate: 360,
      }}
      transition={{
        type: "spring",
        duration: 5,
        bounce: 0.6,
      }}
      class="box"
    ></motion.div>
  {/key}
  <div>
    <RefreshButton
      onclick={() => {
        i++;
      }}
    />
  </div>
</Box>
