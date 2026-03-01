<script lang="ts">
    import { motion } from '$lib/motion-start';
    import { page } from '$app/state';

    const type = $derived(page.url.searchParams.get('type') || true);
    let state = $state(false);

    const transition = {
        default: { duration: 0.2, ease: () => 0.1 },
    };

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
    };

    const b = {
        ...box,
        top: 100,
        left: 200,
        width: 300,
        height: 300,
    };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<motion.div
    id="a"
    layoutId="box"
    layout={type}
    style={a}
    onclick={() => state = !state}
    transition={transition}
/>

{#if state}
    <motion.div
        id="b"
        layoutId="box"
        style={b}
        transition={transition}
        onclick={() => state = !state}
    />
{/if}
