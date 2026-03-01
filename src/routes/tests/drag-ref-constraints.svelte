<script lang="ts">
    /**
     * Drag ref constraints test fixture - ported from motiondivision/motion v11.11.11
     * Tests drag constraints using a ref to a container element
     */
    import { motion } from '$lib/motion-start';
    import { onMount } from 'svelte';

    // Ref to the constraints container (wrapped in {current} for framer-motion compat)
    let constraintsElement: HTMLDivElement | null = $state(null);
    let constraintsRef = $derived({ current: constraintsElement });

    onMount(() => {
        (window as any).__testReady = true;
    });
</script>

<div
    id="constraints"
    bind:this={constraintsElement}
    style="width: 300px; height: 300px; background: #eee;"
>
    {#if constraintsElement}
        <motion.div
            id="box"
            drag
            dragConstraints={constraintsRef}
            style={{
                width: '100px',
                height: '100px',
                background: 'red',
            }}
        />
    {/if}
</div>

<style>
    #constraints {
        position: relative;
    }
</style>
