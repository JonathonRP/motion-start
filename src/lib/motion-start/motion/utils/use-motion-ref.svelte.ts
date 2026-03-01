/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { VisualElement } from '../../render/VisualElement.svelte';
import type { VisualState } from './use-visual-state.svelte';
import { isRefObject } from '../../utils/is-ref-object.js';
import type { Ref, RefCallBack } from '../../utils/safe-react-types';
import { untrack } from 'svelte';

/**
 * Creates a ref function that, when called, hydrates the provided
 * external ref and VisualElement.
 */
export function useMotionRef<Instance, RenderState>(
	visualState: VisualState<Instance, RenderState>,
	visualElement?: VisualElement<Instance> | null,
	externalRef?: Ref<Instance>
): Ref<Instance> {
	return (instance: Instance | null) => {
		instance && visualState.mount && visualState.mount(instance);

		if (visualElement) {
			if (instance) {
				visualElement.mount(instance);
			} else {
				visualElement.unmount();
			}
		}

		if (externalRef) {
			if (typeof externalRef === 'function') {
				externalRef(instance);
			} else if (isRefObject(externalRef)) {
				(externalRef as any).current = instance;
			}
		}
	};
}

/**
 * Creates a STABLE ref function that captures getters for its dependencies.
 * This ensures the ref callback is stable (same function identity) while still
 * accessing the latest values when invoked.
 * 
 * Use this when the ref needs to be passed as a prop without causing re-renders
 * or attachment re-runs due to function identity changes.
 */
export function useStableMotionRef<Instance, RenderState>(
	getVisualState: () => VisualState<Instance, RenderState>,
	getVisualElement: () => VisualElement<Instance> | null | undefined,
	getExternalRef: () => Ref<Instance> | undefined
): Ref<Instance> {
	// Return a stable function - it will always be the same function reference
	const stableRef = (instance: Instance | null) => {
		// Use untrack to prevent reactive tracking when reading via getters.
		// This is critical because the attachment runs in an effect context,
		// and we don't want changes to visualElement/visualState/externalRef
		// to cause the attachment to re-run.
		untrack(() => {
			// Access current values via getters at call time
			const visualState = getVisualState();
			const visualElement = getVisualElement();
			const externalRef = getExternalRef();

			instance && visualState.mount && visualState.mount(instance);

			if (visualElement) {
				if (instance) {
					visualElement.mount(instance);
				} else {
					visualElement.unmount();
				}
			}

			if (externalRef) {
				if (typeof externalRef === 'function') {
					externalRef(instance);
				} else if (isRefObject(externalRef)) {
					(externalRef as any).current = instance;
				}
			}
		});
	};

	return stableRef;
}
