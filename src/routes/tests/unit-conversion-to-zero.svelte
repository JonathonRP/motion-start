<script lang="ts">
    /**
     * An example of animating between different value types
     */
    import { animate } from '$lib/motion-start';
    import { onMount } from 'svelte';

    onMount(() => {
        animate('#box', { y: ['100%', 0] }, { duration: 10, ease: () => 0 });
    });
</script>

<div
    style={{
        width: 100,
        height: 100,
        background: '#ffaa00',
    }}
    id="box"
/>
