<script>
    import Box from "../Box.svelte";
    import { motion, useAnimation } from "$lib/motion-start";
    let controls = useAnimation();
</script>

<Box cls="bg-slate-800 text-black" minHeight={350}>
    <div
        class="bg-gray-500/10 h-72 w-72 flex justify-center items-center rounded-xl shadow-md"
    >
        <motion.div
            drag={true}
            dragConstraints={{
                top: -100,
                bottom: 100,
                right: 100,
                left: -100,
            }}
            dragTransition={{
                bounceStiffness: 600,
                bounceDamping: 20,
            }}
            dragElastic={0.5}
            whileTap={{
                cursor: "grabbing",
            }}
            class="box">Smooth Drag</motion.div
        >
    </div>
</Box>
