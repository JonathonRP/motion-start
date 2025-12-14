/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { Context } from 'runed';
import type { CreateVisualElement } from '../render/types';

export interface LazyContext {
	renderer?: CreateVisualElement<any>;
	strict: boolean;
}

export const LazyContext = new Context<LazyContext>("LazyContext");
