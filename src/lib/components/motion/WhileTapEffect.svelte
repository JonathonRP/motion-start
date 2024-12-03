<script>
    import Box from "../Box.svelte";
    import { motion } from "$lib/motion-start";
</script>

<Box cls="bg-slate-800 flex gap-3 md:gap-10 text-black">
    <motion.div
        whileTap={{
            rotate: 45,
            scale: 0.75,
        }}
        class="box">Rotate</motion.div
    >
    <motion.div
        whileTap={{
            scale: 0.84,
        }}
        class="box">Simple</motion.div
    >
</Box>
