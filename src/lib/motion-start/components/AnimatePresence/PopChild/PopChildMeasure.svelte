<script lang="ts">
import type { MeasureProps } from './types';

let { isPresent, children, child = $bindable(), size = $bindable() }: MeasureProps = $props();
</script>

{@render children()}
