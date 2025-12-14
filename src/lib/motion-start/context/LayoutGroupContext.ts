/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { Context } from 'runed';
import type { NodeGroup } from '../projection/node/group';
import type { MutableRefObject } from '../utils/safe-react-types';

export interface LayoutGroupContext {
	id?: string;
	group?: NodeGroup;
	forceRender?: VoidFunction;
	key?: MutableRefObject<number>;
}

export const LayoutGroupContext = new Context<LayoutGroupContext>("LayoutGroup");
