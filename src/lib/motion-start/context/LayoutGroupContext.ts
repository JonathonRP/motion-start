/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { NodeGroup } from '../projection/node/group';
import { createContext } from './utils/context';

export interface LayoutGroupContext {
	id?: string;
	group?: NodeGroup;
	forceRender?: VoidFunction;
}

export const LayoutGroupContext = createContext<LayoutGroupContext>({});
