/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { CreateVisualElement } from '../render/types';
export interface LazyContextProps {
	renderer?: CreateVisualElement<any>;
	strict: boolean;
}

import { writable, type Writable } from 'svelte/store';
import { getDomContext } from './DOMcontext';

const LazyContext = (c?: any): Writable<LazyContextProps> => getDomContext('Lazy', c) || writable({ strict: false });

export { LazyContext };
