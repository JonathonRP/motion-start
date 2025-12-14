/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { Context } from 'runed';
import type { VisualElement } from '../../render/VisualElement.svelte';

export interface MotionContext<Instance = unknown> {
	visualElement?: VisualElement<Instance> | null;
	initial?: false | string | string[];
	animate?: string | string[];
}

export const MotionContext = new Context<MotionContext>("MotionContext");
