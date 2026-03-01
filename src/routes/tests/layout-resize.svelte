<script lang="ts">
    import { motion } from '$lib/motion-start';
    import { page } from '$app/state';

    const type = $derived(page.url.searchParams.get('type') || 'true');
    const layoutProp = $derived(type === 'true' ? true : type === 'false' ? false : type);

    let state = $state(true);

    const box = {
        position: 'absolute',
        top: 0,
        left: 0,
        background: 'red',
    };

    const a = {
        ...box,
        width: 100,
        height: 100,
    };

    const b = {
        ...box,
        width: 400,
        height: 200,
        top: 100,
        left: 100,
    };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<motion.div
    id="box"
    data-testid="box"
    layout={layoutProp}
    style={state ? a : b}
    onclick={() => state = !state}
    transition={{ duration: 3 }}
>
    <motion.div
        layout
        id="child"
        style={{ width: 100, height: 100, background: 'blue' }}
        transition={{ duration: 3 }}
    />
</motion.div>
