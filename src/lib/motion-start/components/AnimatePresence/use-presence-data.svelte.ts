import { useContext } from '../../context/use';
import { PresenceContext } from '../../context/PresenceContext';

export function usePresenceData() {
	const context = $derived(useContext(PresenceContext).current);
	return () => (context ? context.custom : undefined);
}
