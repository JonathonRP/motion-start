<script>
    import Box from "../Box.svelte";
    import { Motion } from "$lib/motion-start";
</script>

<Box cls="bg-slate-800 flex text-black">
    <Motion.div
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
        class="box">Drag</Motion.div
    >
</Box>
