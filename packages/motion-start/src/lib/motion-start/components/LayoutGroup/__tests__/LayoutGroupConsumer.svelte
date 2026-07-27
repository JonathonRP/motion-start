<script lang="ts">
import { useLayoutGroupContext } from '../../../context/LayoutGroupContext.svelte.js';

interface Props {
	id: string;
}

let { id }: Props = $props();
const context = useLayoutGroupContext();
</script>

<output data-testid={id}>{context?.id}</output>
