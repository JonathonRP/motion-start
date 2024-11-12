/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { writable, type Writable } from 'svelte/store';
import type { ReorderContextProps } from '../components/Reorder/types';
import { getDomContext } from './DOMcontext';

export const ReorderContext = (c?: any): Writable<ReorderContextProps<any> | null> =>
	getDomContext('Reorder', c) || writable(null);
