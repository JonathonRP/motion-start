<script>
    import Box from "../Box.svelte";
    import { Motion } from "$lib/motion-start";
    let i = 0;
</script>

<Box cls="bg-slate-800 flex">
    {#key i}
        <Motion
            animate={{
                rotate: 360,
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
            }}
            let:motion><div class="box" use:motion></div></Motion
        >
    {/key}
</Box>
