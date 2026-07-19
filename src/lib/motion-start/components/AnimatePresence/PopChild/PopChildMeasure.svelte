<script lang="ts">
import type { MeasureProps } from './types.js';

let { isPresent, children, child = $bindable(), size = $bindable() }: MeasureProps = $props();
</script>

{@render children()}
