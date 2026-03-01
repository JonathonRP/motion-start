<script lang="ts">
    import { animate, animateMini, motion, scroll, useMotionValue, useTransform } from '$lib/motion-start';
    import { onMount } from 'svelte';

    const progress = useMotionValue(0);

    const spacer = {
        height: '100vh',
    };

    const progressStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 80,
        lineHeight: '80px',
        fontWeight: 'bold',
    };

    onMount(() => {
        const stopScrollAnimation = scroll(
            animate('#color', {
                x: [0, 100],
                opacity: [0, 1],
                backgroundColor: ['#fff', '#000'],
            })
        );

        const stopMiniScrollAnimation = scroll(
            animateMini('#color', {
                color: ['#000', '#fff'],
            })
        );

        const stopMotionValueAnimation = scroll(animate(progress, 100));

        return () => {
            stopScrollAnimation();
            stopMiniScrollAnimation();
            stopMotionValueAnimation();
        };
    });

    const progressDisplay = useTransform(() => Math.round(progress.get()));
</script>

<div style={{ ...spacer, backgroundColor: 'red' }} />
<div style={{ ...spacer, backgroundColor: 'green' }} />
<div style={{ ...spacer, backgroundColor: 'blue' }} />
<div style={{ ...spacer, backgroundColor: 'yellow' }} />
<motion.div id="color" style={progressStyle}>
    {progressDisplay.get()}
</motion.div>
