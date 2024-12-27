/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { CreateVisualElement } from '../render/types';
import { createContext } from './utils/context';

export interface LazyContext {
	renderer?: CreateVisualElement<any>;
	strict: boolean;
}

export const LazyContext = createContext<LazyContext>({ strict: false });
