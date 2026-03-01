<script lang="ts">
    import { scroll } from '$lib/motion-start';
    import { onMount } from 'svelte';

    let progress = $state(0);

    const spacer = {
        height: '100vh',
    };

    const progressStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
    };

    onMount(() => {
        return scroll((p: number, info) => {
            console.log(p, info.y);
            progress = 2 - p;
        });
    });
</script>

<div style={{ ...spacer, backgroundColor: 'red' }} />
<div style={{ ...spacer, backgroundColor: 'green' }} />
<div style={{ ...spacer, backgroundColor: 'blue' }} />
<div style={{ ...spacer, backgroundColor: 'yellow' }} />
<div id="progress" style={progressStyle}>
    {progress}
</div>
