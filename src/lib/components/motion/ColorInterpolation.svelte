<script>
    import { Motion, useMotionValue, useTransform } from "$lib/motion-start";
    let x = useMotionValue(0);
    let background = useTransform(
        x,
        [-120, 0, 120],
        ["#a0d", "rgba(0,0,0,0)", "#0bf"],
    );
</script>

<!-- Color Interpolation -->
<Motion.div
    style={{
        background,
    }}
    class=" h-[350px] border border-dashed flex justify-center items-center rounded-3xl"
>
    <Motion.div
        style={{
            x: x,
        }}
        drag="x"
        dragConstraints={{ right: 0, left: 0 }}
        whileTap={{ cursor: "grabbing" }}
        class="w-32 h-32 text-black rounded-full bg-white cursor-grab flex justify-center items-center select-none"
    >
        Drag me
    </Motion.div>
</Motion.div>
