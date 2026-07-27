<script lang="ts">
import PresenceChild from '../PresenceChild/PresenceChild.svelte';
import PresenceParticipant from './PresenceParticipant.svelte';

interface Props {
	participants?: number;
}

let { participants = 2 }: Props = $props();
let isPresent = $state(true);
let completed = $state(0);
</script>

<button id="enter" onclick={() => (isPresent = true)}>enter</button>
<button id="exit" onclick={() => (isPresent = false)}>exit</button>
<output id="completed">{completed}</output>

<PresenceChild
	{isPresent}
	presenceAffectsLayout={true}
	mode="sync"
	onExitComplete={() => completed++}
>
	{#each Array.from({ length: participants }, (_, index) => index) as index (index)}
		<PresenceParticipant id={String(index)} />
	{/each}
</PresenceChild>
