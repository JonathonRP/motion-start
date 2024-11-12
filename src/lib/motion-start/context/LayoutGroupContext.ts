/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { Writable } from 'svelte/store';

import { writable } from 'svelte/store';
import { getDomContext } from './DOMcontext';
import type { NodeGroup } from '../projection/node/group';

export interface LayoutGroupContextProps {
	id?: string;
	group?: NodeGroup;
	forceRender?: VoidFunction;
}

export const LayoutGroupContext = (c?: any): Writable<LayoutGroupContextProps> =>
	getDomContext('LayoutGroup', c) || writable({});
