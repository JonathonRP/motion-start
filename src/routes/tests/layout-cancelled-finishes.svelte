<script lang="ts">
    import { AnimatePresence, motion, useInstantLayoutTransition } from '$lib/motion-start';

    let isVisible = $state(true);
    const startTransition = useInstantLayoutTransition();
</script>

<AnimatePresence show={isVisible}>
    {#snippet children()}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <motion.div
            onclick={() => startTransition(() => isVisible = false)}
            data-testid="cancellable"
            style={{ height: 100 }}
        />
    {/snippet}
</AnimatePresence>
