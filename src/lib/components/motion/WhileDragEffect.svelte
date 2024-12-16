<script>
    import Box from "../Box.svelte";
    import { motion } from "$lib/motion-start";
</script>

<Box>
    <motion.div
        drag={true}
        whileHover={{
            opacity: 1,
        }}
        whileTap={{
            opacity: 1,
            scale: 1.05,
            boxShadow: "0px 5px 8px #222",
        }}
        whileDrag={{
            boxShadow: "0px 8px 12px #222",
            cursor: "grabbing",
            border: "2px solid #0091FF",
        }}
        transition={{
            duration: 0.2,
        }}
        class="box">Drag</motion.div
    >
</Box>
