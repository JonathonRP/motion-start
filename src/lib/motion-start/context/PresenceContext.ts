/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { VariantLabels } from '../motion/types.js';
import type { Writable } from 'svelte/store';
import { createContext } from './create.js';

/**
 * @public
 */
export interface PresenceContext {
	id: number | string;
	isPresent: boolean;
	register: (id: string | number) => () => void;
	onExitComplete?: (id: string | number) => void;
	initial?: false | VariantLabels;
	custom?: any;
	presenceChildren?: Writable<{ key: any }>;
}

/**
 * @public
 */
export const PresenceContext = createContext<PresenceContext | null>(null);
