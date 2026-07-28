<script lang="ts">
    import { AnimatePresence, motion, useInstantLayoutTransition } from 'motion-start';

    let isVisible = $state(true);
    const startTransition = useInstantLayoutTransition();
</script>

<AnimatePresence>
    {#if isVisible}
        <motion.div
            layout
            onclick={() => startTransition(() => isVisible = false)}
            data-testid="cancellable"
            style={{ height: '100px' }}
        />
    {/if}
</AnimatePresence>
