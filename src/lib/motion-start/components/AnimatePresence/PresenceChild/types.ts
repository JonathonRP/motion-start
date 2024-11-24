import type { VariantLabels } from '../../../motion/types';
export interface PresenceChildProps {
	// children: React.ReactElement<any>;
	isPresent: boolean;
	onExitComplete?: () => void;
	initial?: false | VariantLabels;
	custom?: any;
	presenceAffectsLayout: boolean;
	mode: 'sync' | 'popLayout' | 'wait';
	isCustom: boolean;
}
