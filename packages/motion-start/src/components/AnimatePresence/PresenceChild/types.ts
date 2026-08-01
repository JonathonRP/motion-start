import type { Snippet } from 'svelte';
import type { VariantLabels } from '../../../motion/types.js';
import type { ReactiveInvalidation } from '../../../utils/reactive-invalidation.js';

export interface PresenceChildProps {
	presenceKey?: string | number;
	isPresent: boolean;
	onExitComplete?: () => void;
	initial?: false | VariantLabels;
	custom?: any;
	presenceLayoutInvalidation?: ReactiveInvalidation;
	presenceAffectsLayout: boolean;
	mode: 'wait' | 'sync' | 'popLayout';
	children: Snippet;
}
