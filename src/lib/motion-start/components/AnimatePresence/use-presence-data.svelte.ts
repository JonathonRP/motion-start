import { usePresenceContext } from '../../context/PresenceContext.svelte';

export function usePresenceData() {
	const context = $derived(usePresenceContext().current);
	return () => context ? context.custom : undefined;
}
