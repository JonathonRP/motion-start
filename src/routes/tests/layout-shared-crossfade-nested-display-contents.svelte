<script lang="ts">
    /**
     * Test for layout shared crossfade with nested elements using display: contents
     */
    import { motion, AnimatePresence } from '$lib/motion-start';
    import { page } from '$app/state';

    const type = $derived(page.url.searchParams.get('type') || true);
    let state = $state(true);

    const transition = { duration: 1, ease: () => 0.5 };

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
        top: 100,
        left: 200,
    };

    const b = {
        ...box,
        top: 300,
        left: 200,
        width: 300,
        height: 300,
    };

    const childA = {
        width: 100,
        height: 100,
        background: 'blue',
    };

    const childB = {
        width: 100,
        height: 100,
        background: 'blue',
    };

    const items = $derived([{
        key: state ? 'a' : 'b',
        id: state ? 'a' : 'b',
        style: state ? a : b,
        backgroundColor: state ? '#f00' : '#0f0',
        borderRadius: state ? 0 : 20,
        childStyle: state ? childA : childB,
    }]);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<AnimatePresence values={items}>
    {#snippet children({ item })}
        <motion.div style={{ display: 'contents' }}>
            <motion.div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 500,
                    height: 400,
                }}
            >
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
                    <motion.div style={{ display: 'contents' }}>
                        <motion.div
                            id="child"
                            layoutId="child"
                            transition={transition}
                            style={item.childStyle}
                        />
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    {/snippet}
</AnimatePresence>
