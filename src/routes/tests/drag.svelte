<script lang="ts">
    /**
     * Drag test fixture - ported from motiondivision/motion
     * Tests basic drag functionality with constraints, elastic, momentum, etc.
     */
    import { motion, useMotionValue } from '$lib/motion-start';
    import { page } from '$app/state';
    import { onMount } from 'svelte';

    // URL params for test configuration
    const axis = $derived(page.url.searchParams.get('axis') || 'both');
    const lock = $derived(page.url.searchParams.get('lock') === 'true');
    const layout = $derived(page.url.searchParams.get('layout') === 'true');

    // Motion values for tracking position
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // State for displaying values
    let dragState = $state('idle');
    let xValue = $state(0);
    let yValue = $state(0);

    // Subscribe to motion value changes
    $effect(() => {
        const unsubX = x.on('change', (v) => {
            xValue = Math.round(v);
        });
        const unsubY = y.on('change', (v) => {
            yValue = Math.round(v);
        });
        return () => {
            unsubX();
            unsubY();
        };
    });

    function handleDragStart() {
        dragState = 'dragging';
    }

    function handleDragEnd() {
        dragState = 'idle';
    }

    // Determine drag prop based on axis
    const dragProp = $derived(
        axis === 'x' ? 'x' as const :
        axis === 'y' ? 'y' as const :
        true as const
    );

    onMount(() => {
        (window as any).__testReady = true;
    });
</script>

<div id="container" style="padding: 100px;">
    <div id="output">
        <span id="state">{dragState}</span>
        <span id="x">{xValue}</span>
        <span id="y">{yValue}</span>
    </div>

    <motion.div
        id="box"
        drag={dragProp}
        dragDirectionLock={lock}
        layout={layout}
        dragConstraints={{
            top: -100,
            left: -100,
            right: 100,
            bottom: 100,
        }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{
            x,
            y,
            width: '100px',
            height: '100px',
            background: 'red',
        }}
    />
</div>

<style>
    #container {
        position: relative;
        width: 400px;
        height: 400px;
        background: #f0f0f0;
    }
    #output {
        display: flex;
        gap: 16px;
        margin-bottom: 20px;
        font-family: monospace;
    }
</style>
