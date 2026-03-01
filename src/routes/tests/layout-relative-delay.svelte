<script lang="ts">
    import { m, LazyMotion, domMax } from '$lib/motion-start';

    let state = $state(true);
    let frameCount = 0;
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<LazyMotion features={domMax}>
    <m.div
        id="parent"
        onclick={() => state = !state}
        layout
        style={{
            position: 'absolute',
            top: state ? 0 : 200,
            left: state ? 0 : 200,
            width: state ? 200 : 400,
            height: 200,
            background: 'red',
        }}
        transition={{
            ease: (t) => {
                frameCount++;
                // This is a bit funny but boxes are resolved relatively after
                // the first frame
                return frameCount > 1 ? 0.5 : t;
            },
        }}
    >
        <m.div
            id="child"
            layout
            style={{
                width: state ? 100 : 200,
                height: 100,
                background: 'blue',
            }}
            transition={{
                delay: 100,
            }}
        />
    </m.div>
</LazyMotion>
