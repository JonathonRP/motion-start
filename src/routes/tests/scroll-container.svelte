<script lang="ts">
    import { useScroll, motion, useMotionValueEvent } from '$lib/motion-start';

    let containerRef: HTMLDivElement | undefined = $state();
    let targetRef: HTMLDivElement | undefined = $state();

    // Note: useScroll in Svelte needs to be set up after refs are bound
    const { scrollYProgress } = useScroll({
        get container() { return containerRef; },
        get target() { return targetRef; },
        offset: ['start start', 'end start'],
    });

    useMotionValueEvent(scrollYProgress, 'change', console.log);
</script>

<div style="height: 100px; width: 100px;"></div>
<div
    id="container"
    bind:this={containerRef}
    style={{
        overflowY: 'auto',
        height: 300,
        width: 300,
        position: 'relative',
    }}
>
    <div style="height: 1000px; width: 300px; background: red;">
        <div
            bind:this={targetRef}
            style={{
                width: 100,
                height: 100,
                fontSize: 24,
                display: 'flex',
                background: 'white',
            }}
        >
            <motion.span id="label">{scrollYProgress.get()}</motion.span>
        </div>
    </div>
</div>
