<script lang="ts">
    import { motion, LayoutGroup } from '$lib/motion-start';

    const style = {
        width: 100,
        height: 100,
        opacity: 1,
        borderRadius: 20,
        margin: 20,
    };

    const containerStyle = {
        display: 'block',
        width: 'min-content',
        height: 'min-content',
    };

    const stackStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        width: 'auto',
        height: 'auto',
        backgroundColor: 'blue',
    };

    interface ItemState {
        id: string;
        visible: boolean;
        backgroundColor: string;
    }

    let items = $state<ItemState[]>([
        { id: 'a', visible: true, backgroundColor: 'red' },
        { id: 'b', visible: true, backgroundColor: 'yellow' },
    ]);

    function hideItem(id: string) {
        items = items.map(item =>
            item.id === id ? { ...item, visible: false } : item
        );
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<LayoutGroup id="group-1">
    <motion.div style={{ position: 'absolute', left: 100, bottom: 100 }}>
        <LayoutGroup id="list">
            <motion.div style={{ display: 'contents' }}>
                <motion.div
                    id="stack"
                    layoutId="stack"
                    style={containerStyle}
                    transition={{ duration: 0.2, ease: () => 0.5 }}
                >
                    <motion.div style={stackStyle}>
                        <motion.div style={{ display: 'contents' }}>
                            {#each items as item (item.id)}
                                <LayoutGroup id="group-2">
                                    <motion.div style={{ display: 'contents' }}>
                                        {#if item.visible}
                                            <motion.div
                                                id={item.id}
                                                layoutId={item.id}
                                                style={{ ...style, backgroundColor: item.backgroundColor }}
                                                onclick={() => hideItem(item.id)}
                                                transition={{ duration: 10, ease: () => 0.5 }}
                                            />
                                        {/if}
                                    </motion.div>
                                </LayoutGroup>
                            {/each}
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </LayoutGroup>
    </motion.div>
</LayoutGroup>
