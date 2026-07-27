<script lang="ts">
import { useReorderContext } from '../../../context/ReorderContext.js';
import type { ReorderContext } from '../types.js';

interface Props {
	oncontext: (context: ReorderContext<string> | null) => void;
}

let { oncontext }: Props = $props();

const context = useReorderContext();

$effect.pre(() => {
	oncontext(context);
});
</script>
