/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { createContext } from 'svelte'
import type { VisualElement } from '../../render/VisualElement.svelte';
import type { MutableRefObject } from '$lib/motion-start/utils/safe-react-types';
import { ref } from '$lib/motion-start/utils/ref.svelte';

export interface MotionContext<Instance = unknown> {
	visualElement?: VisualElement<Instance> | null;
	initial?: false | string | string[];
	animate?: string | string[];
}

const [getMotionContext, setMotionContext] = createContext<MutableRefObject<MotionContext>>();

function useMotionContext() {
	try {
		return getMotionContext();
	} catch {
		return ref({});// Return empty context if none is found
	}
}

export { useMotionContext, setMotionContext };