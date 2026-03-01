<script lang="ts">
    import { AnimatePresence, motion } from '$lib/motion-start';

    let range = $state([0, 1, 2]);

    const containerStyles = {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: '100px',
    };

    const boxStyles = {
        width: '100px',
        height: '100px',
        backgroundColor: 'red',
    };

    function removeItem() {
        range = range.slice(0, -1);
    }

    // Map range to items with keys for AnimatePresence
    const items = $derived(range.map(i => ({ key: i, id: i })));
</script>

<div style="position: relative; display: flex; flex-direction: column; padding: 100px;">
    <button id="remove" onclick={removeItem}>
        Remove
    </button>
    <AnimatePresence values={items}>
        {#snippet children({ item })}
            <motion.div
                id="box-{item.id}"
                class="box"
                style={boxStyles}
                transition={{ duration: 0.5 }}
                exit={{ opacity: 0.5 }}
            />
        {/snippet}
    </AnimatePresence>
</div>
