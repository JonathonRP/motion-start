import type { VariantLabels } from '../../../motion/types';
import type { Snippet } from 'svelte';

export interface PresenceChildProps {
	presenceKey?: string | number;
	isPresent: boolean;
	onExitComplete?: () => void;
	initial?: false | VariantLabels;
	custom?: any;
	presenceAffectsLayout: boolean;
	/** Shared layout dependency counter from parent AnimatePresence — bumped after DOM removal so watch fires didUpdate() */
	sharedLayoutDependency?: number;
	/** Shared snapshot dependency — bumped (with flushSync) before DOM removal so watch.pre fires willUpdate() */
	sharedSnapshotDependency?: number;
	mode: 'wait' | 'sync' | 'popLayout';
	children: Snippet;
}
