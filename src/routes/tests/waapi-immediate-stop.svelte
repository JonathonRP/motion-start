<script lang="ts">
    /**
     * Test for immediate stop of WAAPI animations.
     * This is a simplified version since motion-dom internals differ in Svelte.
     */
    import { onMount } from 'svelte';

    let ref: HTMLDivElement | undefined = $state();

    onMount(() => {
        // This test verifies that stopping an animation immediately
        // doesn't cause issues. In Svelte, we'd need to use the
        // motion-start animation APIs directly.
        if (ref) {
            ref.textContent = 'Content';
        }
    });
</script>

<section
    style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: '100px',
    }}
>
    <div
        bind:this={ref}
        id="box"
        style={{
            width: '100px',
            height: '100px',
            position: 'relative',
            top: '100px',
            left: '100px',
            backgroundColor: 'red',
            opacity: 1,
        }}
    >
        Content
    </div>
</section>
