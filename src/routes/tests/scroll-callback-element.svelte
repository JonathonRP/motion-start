<script lang="ts">
    import { scroll } from '$lib/motion-start';
    import { onMount } from 'svelte';

    const height = 400;
    let progress = $state(0);
    let scrollerRef: HTMLDivElement | undefined = $state();

    onMount(() => {
        if (!scrollerRef) return;
        return scroll((p: number) => progress = p, { source: scrollerRef });
    });
</script>

<div
    id="scroller"
    bind:this={scrollerRef}
    style="width: 100px; height: {height}px; overflow: scroll;"
>
    <div style="height: {height}px; background-color: red;"></div>
    <div style="height: {height}px; background-color: green;"></div>
    <div style="height: {height}px; background-color: blue;"></div>
    <div style="height: {height}px; background-color: yellow;"></div>
    <div id="progress" style="position: fixed; top: 0; left: 0;">
        {progress}
    </div>
</div>
