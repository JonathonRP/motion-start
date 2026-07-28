<script lang="ts">
/**
 * An example of animating between different value types
 */
import { animate } from 'motion-start';
import { onMount } from 'svelte';

onMount(() => {
	animate('#box', { y: ['100%', 0] }, { duration: 10, ease: () => 0 });
});
</script>

<div style="width: 100px; height: 100px; background: #ffaa00;" id="box"></div>
