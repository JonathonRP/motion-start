<script lang="ts">
    import { motion, AnimatePresence } from '$lib/motion-start';

    let isOpen = $state(false);
    let error = $state('');
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div style="position: relative;">
    <AnimatePresence mode="wait" show={isOpen}>
        {#snippet children()}
            <motion.div
                layoutId="1"
                id="open"
                style={{
                    height: '400px',
                    width: '400px',
                    backgroundColor: 'red',
                    position: 'absolute',
                    top: '200px',
                    left: '200px',
                }}
                transition={{ duration: 0.1 }}
                onLayoutMeasure={(layout) => {
                    if (layout.x.min !== 200) {
                        error = 'Layout measured incorrectly';
                    }
                }}
                onclick={() => isOpen = false}
            />
        {/snippet}
    </AnimatePresence>
    <motion.div
        id="target"
        layoutId="1"
        style={{
            height: '200px',
            width: '200px',
            backgroundColor: 'blue',
        }}
        transition={{ duration: 0.1 }}
        onclick={() => isOpen = true}
    />
    <div id="error" style="color: red;">
        {error}
    </div>
</div>
