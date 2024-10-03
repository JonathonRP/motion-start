<script>
    import Box from "../Box.svelte";
    import { Motion } from "$lib/motion-start";
</script>

<Box cls="bg-slate-800 flex gap-3 md:gap-10 flex-col md:flex-row text-black">
    <Motion.div
        whileHover={{
            scale: 0.86,
        }}
        class="box">Scale</Motion.div
    >
    <Motion.div
        whileHover={{
            scale: 0.8,
            rotate: 45,
        }}
        class="box">Hover Rotate</Motion.div
    >
    <Motion.div
        whileHover={{
            backgroundColor: "#0091FF",
        }}
        class="box">BgColor</Motion.div
    >
</Box>
