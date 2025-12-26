<script module lang="ts">
import { provideScaleCorrection } from './scale-correction-context.svelte.js';
export { ScaleCorrectionContext, ScaleCorrectionParentContext, provideScaleCorrection } from './scale-correction-context.svelte.js';
</script>

<script lang="ts">
  let { isCustom } = $props();
  provideScaleCorrection(isCustom);
</script>

<slot />
