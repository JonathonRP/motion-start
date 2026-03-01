<script lang="ts">
    import { motion, AnimatePresence } from '$lib/motion-start';
    import { onMount } from 'svelte';

    let visible = $state(true);

    const animation = {
        x: 0,
        opacity: 0.5,
    };

    onMount(() => {
        visible = !visible;
    });
</script>

<AnimatePresence show={visible}>
    {#snippet children()}
        <motion.div
            id="box"
            layout
            style={{ width: 100, height: 100, background: 'blue' }}
            transition={{ duration: 0.1 }}
            exit={animation}
        />
    {/snippet}
</AnimatePresence>
