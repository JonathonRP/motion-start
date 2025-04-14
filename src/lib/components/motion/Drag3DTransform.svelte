<svelte:options runes={false} />

<script>
    import Box from "../Box.svelte";
    import { motion, useTransform, useMotionValue } from "$lib/motion-start";
    let x = useMotionValue(0);
    let y = useMotionValue(0);
    let rotateX = useTransform(y, [-100, 100], [60, -60]);
    let rotateY = useTransform(x, [-100, 100], [-60, 60]);
</script>

<Box>
    <div class="small_circle">
        <motion.div
            id="drag3dtransform"
            style={{
                left: -25,
                top: -25,
                position: "relative",
                cursor: "grab",
                x,
                y,
                rotateX,
                rotateY,
            }}
            drag={true}
            dragConstraints={{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}
            dragElastic={0.6}
            whileTap={{ cursor: "grabbing" }}
            class="box font-medium"
        >
            3D</motion.div
        >
    </div>
</Box>

<style>
    .small_circle {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: radial-gradient(
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0.3)
        );
        perspective: 800;
    }
</style>
