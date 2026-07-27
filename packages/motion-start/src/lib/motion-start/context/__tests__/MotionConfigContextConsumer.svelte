<script lang="ts">
	import { useMotionConfigContext } from '../MotionConfigContext.svelte.js';

	const context = useMotionConfigContext();
</script>

<output data-testid="reduced-motion">{context.reducedMotion}</output>
