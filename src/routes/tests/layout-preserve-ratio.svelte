<script lang="ts">
    import { mix, motion, useAnimationFrame, useMotionValue } from '$lib/motion-start';

    let state = $state(false);

    const transition = {
        default: { duration: 5 },
    };

    // Force animation frames to pull transform
    const opacity = useMotionValue(0);
    useAnimationFrame(() => opacity.set(mix(0.99, 1, Math.random())));
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<motion.div
    layout
    style={state
        ? { width: 100, height: 200, background: 'black' }
        : { width: 200, height: 200, background: 'black' }
    }
>
    <motion.div
        id="a"
        layout="preserve-aspect"
        style={{
            position: 'absolute',
            top: 100,
            left: 100,
            background: 'red',
            width: state ? 100 : 200,
            height: 200,
            opacity: opacity.get(),
        }}
        onclick={() => state = !state}
        transition={transition}
    />
</motion.div>
