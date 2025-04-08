<svelte:options runes={false} />

<script>
    import Box from "../Box.svelte";
    import { motion } from "$lib/motion-start";
    let i = 0;
</script>

<Box>
    {#key i}
        <motion.div
            animate={{
                rotate: 360,
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
            }}
            class="box"
        ></motion.div>
    {/key}
</Box>
