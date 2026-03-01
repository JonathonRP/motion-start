<script lang="ts">
    import { motion, useMotionValue } from '$lib/motion-start';
    import { page } from '$app/state';

    const type = $derived(page.url.searchParams.get('type') || true);
    let state = $state(true);

    const backgroundColor = useMotionValue('#f00');

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
{#key state ? 'a' : 'b'}
    <motion.div
        id={state ? 'a' : 'b'}
        data-testid="box"
        layoutId="box"
        layout={type}
        style={{
            ...(state ? a : b),
            backgroundColor: backgroundColor.get(),
            borderRadius: state ? 0 : 20,
            opacity: state ? 0.4 : 1,
        }}
        onclick={() => state = !state}
        transition={{ duration: 1, ease: () => 0.5 }}
        onLayoutAnimationStart={() => backgroundColor.set('#0f0')}
        onLayoutAnimationComplete={() => backgroundColor.set('#00f')}
    />
{/key}
