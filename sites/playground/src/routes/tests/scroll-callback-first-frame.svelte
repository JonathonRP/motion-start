<script lang="ts">
import { scroll } from 'motion-start';
import { onMount } from 'svelte';

let progress = $state(0);

const spacerStyle = 'height: 100vh;';
const progressStyle = 'position: fixed; top: 0; left: 0;';

onMount(() => {
	return scroll((p: number, info) => {
		console.log(p, info.y);
		progress = 2 - p;
	});
});
</script>

<div style="{spacerStyle} background-color: red;"></div>
<div style="{spacerStyle} background-color: green;"></div>
<div style="{spacerStyle} background-color: blue;"></div>
<div style="{spacerStyle} background-color: yellow;"></div>
<div id="progress" style={progressStyle}>
	{progress}
</div>
