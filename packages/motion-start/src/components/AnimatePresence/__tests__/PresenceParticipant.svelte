<script lang="ts">
import { usePresence } from '../use-presence.svelte.js';

interface Props {
	id: string;
}

let { id }: Props = $props();
const presence = usePresence();
const present = $derived(presence()[0]);

function completeExit() {
	const state = presence();
	if (!state[0]) state[1]();
}
</script>

<button id={`complete-${id}`} data-present={present} onclick={completeExit}>complete {id}</button>
