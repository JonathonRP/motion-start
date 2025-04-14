<svelte:options runes={false} />

<script>
    import Box from "../Box.svelte";
    import { motion } from "$lib/motion-start";
</script>

<Box cls="gap-3 md:gap-10">
    <motion.div
        id="whiletaprotate"
        whileTap={{
            rotate: 45,
            scale: 0.75,
        }}
        class="box">Rotate</motion.div
    >
    <motion.div
        id="whiletapscale"
        whileTap={{
            scale: 0.84,
        }}
        class="box">Simple</motion.div
    >
</Box>
