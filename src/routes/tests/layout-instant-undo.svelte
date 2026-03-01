<script lang="ts">
    import { motion } from '$lib/motion-start';
    import { tick } from 'svelte';

    let state = $state(true);

    const box = {
        position: 'absolute',
        top: 0,
        left: 200,
        width: 100,
        height: 100,
        background: 'red',
    };

    const a = box;
    const b = { ...box, left: 500 };

    // Using $effect to simulate useLayoutEffect behavior
    $effect(() => {
        if (state === false) {
            // Schedule the state update on next tick to avoid immediate loop
            tick().then(() => {
                state = true;
            });
        }
    });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<motion.div
    id="box"
    data-testid="box"
    layout
    style={state ? a : b}
    onclick={() => state = !state}
    transition={{ duration: 10 }}
/>
