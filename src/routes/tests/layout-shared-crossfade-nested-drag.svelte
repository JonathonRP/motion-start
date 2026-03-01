<script lang="ts">
    /**
     * Layout shared crossfade test: nested drag
     * Tests crossfade transition with nested draggable elements
     * Verifies that drag interactions work correctly during layout animations
     * Ported from motiondivision/motion v11.11.11
     */
    import { motion, AnimatePresence } from '$lib/motion-start';
    import { page } from '$app/state';

    const type = $derived(page.url.searchParams.get('type') || true);
    let state = $state(true);

    const transition = { duration: 1, ease: () => 0.5 };

    const container = {
        position: 'relative',
        width: 500,
        height: 500,
    };

    const box = {
        position: 'absolute',
        top: 0,
        left: 0,
        background: 'red',
    };

    const a = {
        ...box,
        width: 200,
        height: 200,
        top: 50,
        left: 50,
    };

    const b = {
        ...box,
        top: 200,
        left: 200,
        width: 250,
        height: 250,
    };

    const child = {
        width: 80,
        height: 80,
        background: 'blue',
        borderRadius: 10,
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
<div style={container}>
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
            >
                <motion.div
                    id="drag-child"
                    drag
                    dragMomentum={false}
                    dragElastic={0}
                    style={child}
                    transition={transition}
                />
            </motion.div>
        {/snippet}
    </AnimatePresence>
</div>
