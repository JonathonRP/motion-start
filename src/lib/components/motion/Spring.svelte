<svelte:options runes={false} />

<script>
  import Box from "../Box.svelte";
  import RefreshButton from "../RefreshButton.svelte";
  import { motion } from "$lib/motion-start";
  let i = 0;
</script>

<Box cls="flex-col gap-10">
  {#key i}
    <motion.div
      id="springbox"
      animate={{
        rotate: 180,
      }}
      transition={{
        type: "spring",
        damping: 10,
        mass: 0.75,
        stiffness: 100,
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
