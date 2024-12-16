<script>
    import Box from "../Box.svelte";
    import { motion, useMotionValue, useTransform } from "$lib/motion-start";
    let x = useMotionValue(0);
    let background = useTransform(
        x,
        [-120, 0, 120],
        ["#a0d", "rgba(0,0,0,0)", "#0bf"],
    );
</script>

<!-- Color Interpolation -->
<Box cls="grid cols-1 rows-1 justify-stretch">
    <motion.div
        style={{
            background,
        }}
        class="h-full w-full border border-dashed flex justify-center items-center rounded-3xl"
    >
        <motion.div
            style={{
                x: x,
            }}
            drag="x"
            dragConstraints={{ right: 0, left: 0 }}
            whileTap={{ cursor: "grabbing" }}
            class="w-32 h-32 text-black rounded-full bg-white cursor-grab flex justify-center items-center select-none"
        >
            Drag me
        </motion.div>
    </motion.div>
</Box>
