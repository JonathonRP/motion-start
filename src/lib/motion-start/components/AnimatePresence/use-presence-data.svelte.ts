import { usePresenceContext } from '../../context/PresenceContext';

export function usePresenceData() {
	const context = $derived(usePresenceContext().current);
	return context ? context.custom : undefined;
}
