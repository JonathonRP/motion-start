<script lang="ts">
    import { scroll } from '$lib/motion-start';
    import { onMount } from 'svelte';

    const width = 400;
    let progress = $state(0);
    let scrollerRef: HTMLDivElement | undefined = $state();

    onMount(() => {
        if (!scrollerRef) return;
        return scroll((p: number) => progress = p, { source: scrollerRef, axis: 'x' });
    });
</script>

<div
    id="scroller"
    bind:this={scrollerRef}
    style="width: {width}px; height: 100px; overflow: scroll; display: flex;"
>
    <div style="width: {width}px; height: 100px; background-color: red; flex-shrink: 0;"></div>
    <div style="width: {width}px; height: 100px; background-color: green; flex-shrink: 0;"></div>
    <div style="width: {width}px; height: 100px; background-color: blue; flex-shrink: 0;"></div>
    <div style="width: {width}px; height: 100px; background-color: yellow; flex-shrink: 0;"></div>
</div>
<div id="progress" style="position: fixed; top: 0; left: 0;">
    {progress}
</div>
