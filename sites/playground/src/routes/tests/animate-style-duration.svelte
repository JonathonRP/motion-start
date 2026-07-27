<script lang="ts">
	import { animateMini, spring } from 'motion-start';
	import { onMount } from 'svelte';

	let boxRef: HTMLDivElement | undefined = $state();

	onMount(() => {
		if (!boxRef) return;

		boxRef.style.backgroundColor = 'red';

		let animation = animateMini(boxRef, { width: [null, 200] }, { duration: 0.1 });

		if (animation.duration === 0.1) {
			animation = animateMini(boxRef, { width: [null, 200] }, {});

			if (animation.duration === 0.3) {
				animation = animateMini(boxRef, { width: [null, 200] }, { type: spring });

				if (animation.duration === 1.1) {
					boxRef.style.backgroundColor = 'green';
				}
			}
		}

		return () => {
			animation.cancel();
		};
	});
</script>

<div
	bind:this={boxRef}
	id="box"
	style="width: 100px; height: 100px; background-color: #fff;"
>
	content
</div>
