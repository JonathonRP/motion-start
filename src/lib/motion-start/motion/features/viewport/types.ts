/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { RefObject } from '../../../utils/safe-react-types';
import type { TargetAndTransition } from '../../../types';
import type { VariantLabels } from '../../types';

export type ViewportEventHandler = (entry: IntersectionObserverEntry | null) => void;

export interface ViewportOptions {
	root?: RefObject<Element>;
	once?: boolean;
	margin?: string;
	amount?: 'some' | 'all' | number;
}

export interface ViewportProps {
	whileInView?: VariantLabels | TargetAndTransition;
	onViewportEnter?: ViewportEventHandler;
	onViewportLeave?: ViewportEventHandler;
	viewport?: ViewportOptions;
}

export type ViewportState = {
	hasEnteredView: boolean;
	isInView: boolean;
};
