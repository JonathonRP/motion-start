<script lang="ts">
    import { motion, useMotionValue } from '$lib/motion-start';
    import { page } from '$app/state';

    const type = $derived(page.url.searchParams.get('type') || 'true');
    const layoutProp = $derived(type === 'true' ? true : type === 'false' ? false : type);

    let state = $state(true);
    const backgroundColor = useMotionValue('red');

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

    function handleClick() {
        state = !state;
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<motion.div
    id="box"
    data-testid="box"
    layout={layoutProp}
    style={{ ...(state ? a : b), backgroundColor: backgroundColor.get() }}
    onclick={handleClick}
    transition={{ duration: 0.5, ease: () => 0.5 }}
    onLayoutAnimationStart={() => backgroundColor.set('green')}
    onLayoutAnimationComplete={() => backgroundColor.set('blue')}
/>
