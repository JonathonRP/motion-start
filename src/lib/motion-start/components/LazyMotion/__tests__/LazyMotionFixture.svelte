<script lang="ts">
	import type { FeatureBundle, LazyFeatureBundle } from '../../../motion/features/types.js';
	import LazyMotion from '../LazyMotion.svelte';
	import LazyMotionConsumer from './LazyMotionConsumer.svelte';

	interface Props {
		features: FeatureBundle | LazyFeatureBundle;
	}

	let { features }: Props = $props();
</script>

<LazyMotion {features}>
	<LazyMotionConsumer />
</LazyMotion>
