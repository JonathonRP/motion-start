<script lang="ts">
    /**
     * An example of animating between different value types
     */
    import { motion } from '$lib/motion-start';
</script>

<motion.div
    animate={{ height: '50vh', width: 100 }}
    transition={{ duration: 5, ease: () => 0.5 }}
    style={{ width: '50vw', height: 100, background: '#ffaa00' }}
    id="box"
/>
