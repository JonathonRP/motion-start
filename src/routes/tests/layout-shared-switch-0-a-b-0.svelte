<script lang="ts">
    import { motion } from '$lib/motion-start';
    import { page } from '$app/state';

    const type = $derived(page.url.searchParams.get('type') || true);
    let count = $state(0);

    const transition = {
        default: { duration: 5, ease: () => 0.5 },
    };

    const overlay = {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
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
<div
    id="trigger"
    style={overlay}
    onclick={() => count = count + 1}
>
    {#if count === 1 || count === 3}
        <motion.div
            id="a"
            layoutId="box"
            layout={type}
            style={a}
            transition={transition}
        />
    {/if}
    {#if count === 2}
        <motion.div
            id="b"
            layoutId="box"
            style={b}
            transition={transition}
        />
    {/if}
</div>
