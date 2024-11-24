<script>
    import Box from "../Box.svelte";
    import { motion } from "$lib/motion-start";
    let i = 0;
</script>

<Box cls="bg-slate-800 flex" minHeight={350}>
    {#key i}
        <motion.div
            animate={{
                rotate: 360,
            }}
            transition={{
                ease: "linear",
                duration: 2,
                repeat: Infinity,
            }}
            class="box"
        ></motion.div>
    {/key}
</Box>
