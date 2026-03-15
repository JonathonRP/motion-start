import type { VariantLabels } from '../../../motion/types';
import type { Snippet } from 'svelte';

export interface PresenceChildProps {
	presenceKey?: string | number;
	isPresent: boolean;
	onExitComplete?: () => void;
	initial?: false | VariantLabels;
	custom?: any;
	presenceAffectsLayout: boolean;
	/** Shared layout dependency counter from parent AnimatePresence — bumped when any sibling changes presence */
	sharedLayoutDependency?: number;
	/** Bumped before DOM removal to trigger willUpdate() snapshot while exiting sibling still in DOM */
	sharedSnapshotTrigger?: number;
	mode: 'wait' | 'sync' | 'popLayout';
	children: Snippet;
}
