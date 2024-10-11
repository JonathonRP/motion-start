<script>
    import Box from "../Box.svelte";
    import { Motion } from "$lib/motion-start";
    let i = 0;
</script>

<Box cls="bg-slate-800 flex">
    {#key i}
        <Motion.div
            animate={{
                rotate: 360,
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
            }}
            class="box"
        ></Motion.div>
    {/key}
</Box>
