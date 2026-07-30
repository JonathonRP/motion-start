<script lang="ts">
import type { createReactiveInvalidation } from '../reactive-invalidation.js';

interface Props {
	invalidation: ReturnType<typeof createReactiveInvalidation>;
	onrun: (token: unknown) => void;
}

let { invalidation, onrun }: Props = $props();

$effect(() => {
	onrun(invalidation.current);
});
</script>
