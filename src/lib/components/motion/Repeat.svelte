<script>
import { Motion } from '$lib/motion-start';
import Box from '../Box.svelte';

let i = 0;
</script>

<Box cls="bg-slate-800 flex" minHeight={350}>
    {#key i}
        <Motion.div
            animate={{
                rotate: 360,
            }}
            transition={{
                ease: "linear",
                duration: 2,
                repeat: Infinity,
            }}
            class="box"
        ></Motion.div>
    {/key}
</Box>
