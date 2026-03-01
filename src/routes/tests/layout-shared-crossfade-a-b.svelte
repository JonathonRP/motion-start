<script lang="ts">
    /**
     * Layout shared crossfade test: a -> b
     * Tests simple crossfade transition from element "a" to element "b"
     * Uses AnimatePresence with values array pattern for crossfade
     * Ported from motiondivision/motion v11.11.11
     */
    import { motion, AnimatePresence } from '$lib/motion-start';
    import { page } from '$app/state';

    const type = $derived(page.url.searchParams.get('type') || true);
    let state = $state(true);

    const transition = {
        default: { duration: 1, ease: () => 0.5 },
        opacity: { duration: 1, ease: () => 0.1 },
    };

    const box = {
        position: 'absolute',
        top: 0,
        left: 0,
        background: 'red',
    };

    const a = {
        ...box,
        width: 100,
        height: 200,
    };

    const b = {
        ...box,
        top: 100,
        left: 200,
        width: 300,
        height: 300,
    };

    const items = $derived([{
        key: state ? 'a' : 'b',
        id: state ? 'a' : 'b',
        style: state ? a : b,
        backgroundColor: state ? '#f00' : '#0f0',
        borderRadius: state ? 0 : 20,
    }]);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<AnimatePresence values={items}>
    {#snippet children({ item })}
        <motion.div
            id={item.id}
            data-testid="box"
            layoutId="box"
            layout={type}
            style={{
                ...item.style,
                backgroundColor: item.backgroundColor,
                borderRadius: item.borderRadius,
            }}
            transition={transition}
            onclick={() => state = !state}
        />
    {/snippet}
</AnimatePresence>
