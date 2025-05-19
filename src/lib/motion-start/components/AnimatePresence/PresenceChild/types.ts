import type { SvelteHTMLElements } from 'svelte/elements';
import type { VariantLabels } from '../../../motion/types';
import type { Snippet } from 'svelte';
import type { Attachment } from 'svelte/attachments';

export interface PresenceChildProps {
	isPresent: boolean;
	onExitComplete?: () => void;
	initial?: false | VariantLabels;
	custom?: any;
	presenceAffectsLayout: boolean;
	mode: 'wait' | 'sync' | 'popLayout';
	children: Snippet<[{ measure?: Attachment }]>;
}
