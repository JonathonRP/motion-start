<script lang="ts">
    /**
     * Layout shared crossfade test: a -> b with transform template change
     * Tests crossfade transition where the transformTemplate prop changes
     * between elements during the crossfade
     * Ported from motiondivision/motion v11.11.11
     */
    import { motion, AnimatePresence } from '$lib/motion-start';
    import { page } from '$app/state';

    const type = $derived(page.url.searchParams.get('type') || true);
    let state = $state(true);

    const box = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        background: 'red',
    };

    const a = {
        ...box,
        width: 100,
        height: 200,
    };

    const b = {
        ...box,
        top: '50%',
        left: '50%',
        width: 300,
        height: 300,
    };

    const items = $derived([{
        key: state ? 'a' : 'b',
        id: state ? 'a' : 'b',
        style: state ? a : b,
        backgroundColor: state ? '#f00' : '#0f0',
        borderRadius: state ? 0 : 20,
        // Transform template changes between states
        useTransformTemplate: state,
    }]);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<motion.div
    style={{
        position: 'relative',
        width: 500,
        height: 500,
        backgroundColor: 'blue',
    }}
>
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
                transition={{ duration: 1, ease: () => 0.5 }}
                onclick={() => state = !state}
                transformTemplate={item.useTransformTemplate
                    ? (_, generated) => `translate(-50%, -50%) ${generated}`
                    : (_, generated) => `rotate(45deg) translate(-50%, -50%) ${generated}`
                }
            />
        {/snippet}
    </AnimatePresence>
</motion.div>
