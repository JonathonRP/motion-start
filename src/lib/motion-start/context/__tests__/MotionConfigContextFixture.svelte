<script lang="ts">
	import {
		createMotionConfigContext,
		setMotionConfigContext,
	} from '../MotionConfigContext.svelte.js';
	import MotionConfigContextConsumer from './MotionConfigContextConsumer.svelte';

	const context = createMotionConfigContext();
	setMotionConfigContext(context);
</script>

<button onclick={() => context.setConfig({ reducedMotion: 'always' })}>Always reduce motion</button>
<MotionConfigContextConsumer />
