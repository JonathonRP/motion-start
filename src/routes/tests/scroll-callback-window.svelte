<script lang="ts">
    import { scroll, frameData } from '$lib/motion-start';
    import { onMount } from 'svelte';

    let progress = $state(0);
    let error = $state('');

    onMount(() => {
        let prevFrameStamp = 0;

        return scroll((p) => {
            progress = p;

            if (prevFrameStamp === frameData.timestamp) {
                error = 'Concurrent event handlers detected';
            }

            prevFrameStamp = frameData.timestamp;
        });
    });
</script>

<div style="height: 100vh; background-color: red;"></div>
<div style="height: 100vh; background-color: green;"></div>
<div style="height: 100vh; background-color: blue;"></div>
<div style="height: 100vh; background-color: yellow;"></div>
<div id="progress" style="position: fixed; top: 0; left: 0;">
    {progress}
</div>
<div id="error" style="position: fixed; bottom: 0; left: 0;">
    {error}
</div>
