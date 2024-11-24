<script>
    import Box from "../Box.svelte";
    import { motion, useAnimation } from "$lib/motion-start";
    let controls = useAnimation();
    let startCode = async () => {
        let all = [
            { rotate: -90 },
            { scale: 1.5 },
            { rotate: 0 },
            {
                scale: 1,
                borderRadius: "50%",
            },
            { scale: 0.9, borderRadius: "20%" },
        ];
        await controls.start(all[0]);
        await controls.start(all[1]);
        await controls.start(all[2]);
        await controls.start(all[3]);
        await controls.start(all[4]);
    };
</script>

<Box cls="bg-slate-800 text-black">
    <motion.div animate={controls} onTap={startCode} class="box">Tap</motion.div
    >
</Box>
