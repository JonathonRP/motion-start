<script lang="ts">
/**
 * An example of animating between different value types
 */
import { animate } from '$lib/motion-start';
import { onMount } from 'svelte';

let ref: HTMLDivElement | null = $state(null);
const attachBox = (node: HTMLDivElement) => {
	ref = node;
	return () => {
		if (ref === node) ref = null;
	};
};

onMount(() => {
	if (!ref) return;
	const element = ref;

	let disposed = false;
	let widthAnimation: ReturnType<typeof animate> | undefined;
	const rotateAnimation = animate(element, { width: [0, 100], rotate: [0, 45] }, { duration: 0.1, ease: 'linear' });

	rotateAnimation.then(() => {
		if (disposed) return;
		widthAnimation = animate(
			element,
			{ width: '50%' },
			{
				duration: 0.2,
				ease: 'linear',
				onUpdate: (width) => {
					if (typeof width === 'number' && width > 200) {
						element.textContent = 'Fail';
					}
				},
			}
		);
	});

	return () => {
		disposed = true;
		rotateAnimation.stop();
		widthAnimation?.stop();
	};
});
</script>

<div style="width: 400px;">
	<div {@attach attachBox} style="width: 100px; height: 100px; background: #ffaa00;" id="box">
		Success
	</div>
</div>
