<script lang="ts">
    import { motion, LayoutGroup } from '$lib/motion-start';

    const style = {
        width: 100,
        height: 100,
        background: 'red',
        opacity: 1,
        borderRadius: 20,
        margin: 20,
    };

    const stackStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
    };

    let variant = $state('a');
    const isVisible = $derived(variant === 'a');
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<LayoutGroup id="group-1">
    <motion.div style={{ display: 'contents' }}>
        <motion.div style={stackStyle}>
            <LayoutGroup id="group-2">
                <motion.div style={{ display: 'contents' }}>
                    {#if isVisible}
                        <motion.div
                            id="a"
                            layoutId="a"
                            style={style}
                            onclick={() => variant = variant === 'a' ? 'b' : 'a'}
                        />
                    {/if}
                </motion.div>
            </LayoutGroup>
        </motion.div>
        <motion.div
            layoutId="b"
            style={{ ...style, backgroundColor: 'blue' }}
            id="b"
            transition={{ duration: 0.2, ease: () => 0.5 }}
        />
    </motion.div>
</LayoutGroup>
