<script lang="ts">
    import { motion, MotionConfig } from '$lib/motion-start';

    let isOpen = $state(false);

    const box = {
        background: 'red',
    };

    const a = {
        ...box,
        width: 100,
        height: 200,
    };

    const b = {
        ...box,
        width: 300,
        height: 300,
        background: 'blue',
        borderRadius: 20,
    };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<MotionConfig transition={{ duration: 0.1 }}>
    <motion.div
        id="a"
        layoutId="box"
        style={a}
        onclick={() => isOpen = true}
    />
    {#if isOpen}
        <motion.div
            id="b"
            layoutId="box"
            style={b}
            onclick={() => isOpen = false}
        />
    {/if}
</MotionConfig>
