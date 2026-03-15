import { usePresenceContext } from '../../context/PresenceContext.svelte';

export function usePresenceData() {
	const context = usePresenceContext();
	return () => context ? context.custom : undefined;
}
