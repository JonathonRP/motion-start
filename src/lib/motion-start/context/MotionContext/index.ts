/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { createContext } from 'svelte'
import type { VisualElement } from '../../render/VisualElement.svelte';

export interface MotionContext<Instance = unknown> {
	visualElement?: VisualElement<Instance> | null;
	initial?: false | string | string[];
	animate?: string | string[];
}

const [getMotionContext, setMotionContext] = createContext<MotionContext>();

function useMotionContext() {
	try {
		return getMotionContext();
	} catch {
		return {} as MotionContext;
	}
}

export { useMotionContext, setMotionContext };
