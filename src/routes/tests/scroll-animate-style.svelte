<script lang="ts">
    import { scroll, useAnimateMini, animate } from '$lib/motion-start';
    import { onMount } from 'svelte';

    let scopeRef: HTMLDivElement | undefined = $state();

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
        if (!scopeRef) return;

        const stopMiniScrollAnimation = scroll(
            animate(scopeRef, {
                backgroundColor: ['#fff', '#000'],
                color: ['#000', '#fff'],
            })
        );

        const stopScrollAnimation = scroll(
            animate(scopeRef, { x: [0, 100] })
        );

        return () => {
            stopMiniScrollAnimation();
            stopScrollAnimation();
        };
    });
</script>

<div style={{ ...spacer, backgroundColor: 'red' }} />
<div style={{ ...spacer, backgroundColor: 'green' }} />
<div style={{ ...spacer, backgroundColor: 'blue' }} />
<div style={{ ...spacer, backgroundColor: 'yellow' }} />
<div bind:this={scopeRef} id="color" style={progressStyle}>
    A
</div>
