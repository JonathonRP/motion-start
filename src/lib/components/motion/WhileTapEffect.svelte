<script>
import { Motion } from '$lib/motion-start';
import Box from '../Box.svelte';
</script>

<Box cls="bg-slate-800 flex gap-3 md:gap-10 text-black">
    <Motion.div
        whileTap={{
            rotate: 45,
            scale: 0.75,
        }}
        class="box">Rotate</Motion.div
    >
    <Motion.div
        whileTap={{
            scale: 0.84,
        }}
        class="box">Simple</Motion.div
    >
</Box>
