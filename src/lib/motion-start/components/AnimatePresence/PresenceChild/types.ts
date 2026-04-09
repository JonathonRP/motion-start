import type { VariantLabels } from '../../../motion/types';
import type { Snippet } from 'svelte';

export interface PresenceChildProps {
	presenceKey?: string | number;
	isPresent: boolean;
	onExitComplete?: () => void;
	initial?: false | VariantLabels;
	custom?: any;
	presenceLayoutVersion?: number;
	presenceAffectsLayout: boolean;
	mode: 'wait' | 'sync' | 'popLayout';
	children: Snippet;
}
