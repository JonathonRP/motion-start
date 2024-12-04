import type { Snippet } from 'svelte';
import type { VariantLabels } from '../../../motion/types';
export interface PresenceChildProps {
	children?: Snippet;
	isPresent: boolean;
	onExitComplete?: () => void;
	initial?: false | VariantLabels;
	custom?: any;
	presenceAffectsLayout: boolean;
	isCustom: boolean;
}
