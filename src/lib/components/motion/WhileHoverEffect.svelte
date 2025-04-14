<svelte:options runes={false} />

<script>
    import Box from "../Box.svelte";
    import { motion } from "$lib/motion-start";
</script>

<Box cls="gap-3 md:gap-10 flex-col md:flex-row">
    <motion.div
        id='whilehoverscale'
        whileHover={{
            scale: 0.86,
        }}
        class="box">Scale</motion.div
    >
    <motion.div
        id="whilehoverrotate"
        whileHover={{
            scale: 0.8,
            rotate: 45,
        }}
        class="box">Hover Rotate</motion.div
    >
    <motion.div
        id='whilehovercolor'
        whileHover={{
            backgroundColor: "#0091FF",
        }}
        class="box">BgColor</motion.div
    >
</Box>
