<svelte:options runes={false} />

<script>
    import Box from "../Box.svelte";
    import Button from "../ui/button/button.svelte";
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
        <Button
            on:click={() => (i += 1)}
            variant="outline"
            class="bg-gray-700/30 border-white/30 text-white"
            size="sm"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-rotate-ccw"
                ><path
                    d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
                /><path d="M3 3v5h5" /></svg
            >
        </Button>
    </div>
</Box>
