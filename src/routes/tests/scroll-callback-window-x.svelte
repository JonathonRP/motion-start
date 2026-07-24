<script lang="ts">
    import { scroll } from '$lib/motion-start';
    import { onMount } from 'svelte';

    let progress = $state(0);

    onMount(() => {
        const previousOverflowX = document.body.style.overflowX;
        const previousOverflowY = document.body.style.overflowY;
        document.body.style.overflowX = 'scroll';
        document.body.style.overflowY = 'hidden';
        const stopScroll = scroll((p: number) => progress = p, { axis: 'x' });

        return () => {
            stopScroll();
            document.body.style.overflowX = previousOverflowX;
            document.body.style.overflowY = previousOverflowY;
        };
    });
</script>

<div style="display: flex; width: 400vw;">
    <div style="width: 100vw; height: 500px; background-color: red; flex-shrink: 0;"></div>
    <div style="width: 100vw; height: 500px; background-color: green; flex-shrink: 0;"></div>
    <div style="width: 100vw; height: 500px; background-color: blue; flex-shrink: 0;"></div>
    <div style="width: 100vw; height: 500px; background-color: yellow; flex-shrink: 0;"></div>
</div>
<div id="progress" style="position: fixed; top: 0; left: 0;">
    {progress}
</div>
