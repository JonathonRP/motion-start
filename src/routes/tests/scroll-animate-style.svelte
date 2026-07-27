<script lang="ts">
import { scroll, useAnimateMini } from '$lib/motion-start';
import { onMount } from 'svelte';

const [scope, animate] = useAnimateMini<HTMLDivElement>();
let scopeRef: HTMLDivElement | null = $state(null);

const spacerStyle = 'height: 100vh;';
const progressStyle =
	'position: fixed; top: 0; left: 0; width: 100px; height: 100px; display: flex; justify-content: center; align-items: center; font-size: 80px; line-height: 80px; font-weight: bold;';

onMount(() => {
	if (!scopeRef) return;

	(scope as { current: HTMLDivElement }).current = scopeRef;

	return scroll(
		animate(
			scope.current,
			{
				backgroundColor: ['#fff', '#000'],
				color: ['#000', '#fff'],
				transform: ['none', 'translateX(100px)'],
			},
			{ ease: 'linear' }
		) as unknown as Parameters<typeof scroll>[0]
	);
});
</script>

<div style="{spacerStyle} background-color: red;"></div>
<div style="{spacerStyle} background-color: green;"></div>
<div style="{spacerStyle} background-color: blue;"></div>
<div style="{spacerStyle} background-color: yellow;"></div>
<div bind:this={scopeRef} id="color" style={progressStyle}>A</div>
