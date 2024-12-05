import type { SvelteHTMLElements } from 'svelte/elements';
import type { VariantLabels } from '../../../motion/types';
import type { Snippet } from 'svelte';
export interface PresenceChildProps {
	children: Snippet;
	isPresent: boolean;
	onExitComplete?: () => void;
	initial?: false | VariantLabels;
	custom?: any;
	presenceAffectsLayout: boolean;
	mode: 'sync' | 'popLayout' | 'wait';
}
