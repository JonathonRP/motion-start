<script lang="ts">
    import { motion } from '$lib/motion-start';
    import { page } from '$app/state';

    let state = $state(true);
    const nested = $derived(page.url.searchParams.get('nested') === 'true');

    const scrollable = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 500,
        overflow: 'scroll',
    };

    const container = {
        marginTop: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    };

    const box = {
        width: 100,
        height: 100,
        borderRadius: 10,
        backgroundColor: '#ffaa00',
    };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if nested}
    <motion.div layoutScroll id="scrollable" style={scrollable}>
        <div style={{ ...container, height: state ? 1000 : 'auto' }}>
            <motion.div
                layout
                id="box"
                style={box}
                onclick={() => state = !state}
                transition={{ ease: () => 0.1 }}
            />
        </div>
    </motion.div>
{:else}
    <div style={{ ...container, height: state ? 1000 : 'auto' }}>
        <motion.div
            layout
            id="box"
            style={box}
            onclick={() => state = !state}
            transition={{ ease: () => 0.1 }}
        />
    </div>
{/if}
