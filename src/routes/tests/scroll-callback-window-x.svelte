<script lang="ts">
    import { scroll } from '$lib/motion-start';
    import { onMount } from 'svelte';

    let progress = $state(0);

    onMount(() => {
        return scroll((p: number) => progress = p, { axis: 'x' });
    });
</script>

<div style="display: flex; width: 400vw;">
    <div style="width: 100vw; height: 100vh; background-color: red; flex-shrink: 0;"></div>
    <div style="width: 100vw; height: 100vh; background-color: green; flex-shrink: 0;"></div>
    <div style="width: 100vw; height: 100vh; background-color: blue; flex-shrink: 0;"></div>
    <div style="width: 100vw; height: 100vh; background-color: yellow; flex-shrink: 0;"></div>
</div>
<div id="progress" style="position: fixed; top: 0; left: 0;">
    {progress}
</div>
