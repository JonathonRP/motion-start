/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { VisualElement } from '../../render/VisualElement.svelte.js';
import { createContext } from '../create.js';

export interface MotionContext<Instance = unknown> {
	visualElement?: VisualElement<Instance> | null;
	initial?: false | string | string[];
	animate?: string | string[];
}

export const MotionContext = createContext<MotionContext>({});
