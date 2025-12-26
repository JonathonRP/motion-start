<script>
import { Motion } from '$lib/motion-start';
import Box from '../Box.svelte';

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
