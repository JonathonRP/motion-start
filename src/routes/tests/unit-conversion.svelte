<script lang="ts">
    import { motion, useCycle, useMotionValue } from '$lib/motion-start';
    import { page } from '$app/state';

    const isExternalMotionValue = $derived(page.url.searchParams.get('use-motion-value') || false);
    const isRoundTrip = $derived(page.url.searchParams.get('roundtrip') !== null);

    const [x, cycleX] = useCycle<number | string>(0, 'calc(3 * var(--width))');
    const xMotionValue = useMotionValue(x);
    const value = $derived(isExternalMotionValue ? xMotionValue : undefined);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<motion.div
    initial={false}
    animate={{ x }}
    transition={isRoundTrip
        ? { duration: 0.1 }
        : { duration: 5, ease: () => 0.5 }}
    style={{
        x: value,
        width: 100,
        height: 100,
        background: '#ffaa00',
        '--width': '100px',
    }}
    onclick={() => cycleX()}
    id="box"
/>
