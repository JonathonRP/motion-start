<svelte:options runes={false} />

<script>
    import Box from "../Box.svelte";
    import RefreshButton from "../RefreshButton.svelte";
    import { motion } from "$lib/motion-start";
    let i = 0;
</script>

<Box cls="flex-col gap-10">
    <div class="h-[180px] w-[180px]">
        {#key i}
            <motion.div
                id="keyframe"
                animate={{
                    x: [0, 100, 100, 0, 0],
                    y: [0, 0, 100, 100, 0],
                    backgroundColor: ["#fd3", "#60f", "#fd3"],
                }}
                transition={{ duration: 4, ease: "linear" }}
                class="w-20 h-20 rounded-xl"
            ></motion.div>
        {/key}
    </div>
    <div>
        <RefreshButton
            onclick={() => {
                i++;
            }}
        />
    </div>
</Box>
