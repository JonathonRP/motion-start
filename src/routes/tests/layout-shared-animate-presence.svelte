<script lang="ts">
    import { motion, useCycle, AnimatePresence } from '$lib/motion-start';

    const [count, cycleCount] = useCycle(0, 1, 2, 3);

    const animate = [
        {
            backgroundColor: '#09f',
            borderRadius: 10,
            opacity: 1,
        },
        {
            backgroundColor: '#90f',
            borderRadius: 100,
            opacity: 0.5,
        },
        {
            backgroundColor: '#f09',
            borderRadius: 0,
            opacity: 1,
        },
        {
            backgroundColor: '#9f0',
            borderRadius: 50,
            opacity: 0.5,
        },
    ];

    const styles = [
        {
            width: 100,
            height: 100,
            top: 100,
        },
        {
            width: 200,
            height: 200,
            left: 100,
        },
        {
            width: 100,
            height: 100,
            left: 'calc(100vw - 100px)',
        },
        {
            width: 200,
            height: 200,
        },
    ];

    const items = $derived([{ key: count, id: `shape-${count}` }]);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }}
>
    <AnimatePresence values={items}>
        {#snippet children({ item })}
            <motion.div
                initial={false}
                style={{
                    position: 'absolute',
                    ...styles[item.key],
                }}
                transition={{ duration: 10, ease: () => 0.25 }}
                animate={animate[item.key]}
                layoutId="box"
                id={item.id}
                onclick={() => cycleCount()}
            />
        {/snippet}
    </AnimatePresence>
</div>
