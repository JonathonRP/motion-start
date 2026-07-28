import { usePresenceContext } from '../../context/PresenceContext.svelte.js';

export function usePresenceData() {
	const context = usePresenceContext();
	return () => (context ? context.custom : undefined);
}
