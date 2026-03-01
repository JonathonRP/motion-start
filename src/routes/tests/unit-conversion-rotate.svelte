<script lang="ts">
    /**
     * An example of animating between different value types
     */
    import { animate } from '$lib/motion-start';
    import { onMount } from 'svelte';

    let ref: HTMLDivElement | undefined = $state();

    onMount(() => {
        if (!ref) return;

        animate(
            ref,
            { width: [0, 100], rotate: [0, 45] },
            { duration: 0.1, ease: 'linear' }
        ).then(() => {
            animate(
                ref!,
                { width: '50%' },
                {
                    duration: 0.2,
                    ease: 'linear',
                    onUpdate: (width) => {
                        if (typeof width === 'number' && width > 200) {
                            ref!.textContent = 'Fail';
                        }
                    },
                }
            );
        });
    });
</script>

<div
    bind:this={ref}
    style={{
        width: 100,
        height: 100,
        background: '#ffaa00',
    }}
    id="box"
>
    Success
</div>
