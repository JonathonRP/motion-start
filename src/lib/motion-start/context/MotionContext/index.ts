/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { VisualElement } from '../../render/VisualElement';
import { getDomContext } from '../DOMcontext';
import { writable } from 'svelte/store';

export interface MotionContextProps<Instance = unknown> {
	visualElement?: VisualElement<Instance>;
	initial?: false | string | string[];
	animate?: string | string[];
}

export const MotionContext = (c?: any) => getDomContext('Motion', c) || writable<MotionContextProps>({});
