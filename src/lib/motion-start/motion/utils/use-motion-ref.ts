/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { VisualElement } from '../../render/VisualElement';
import type { VisualState } from './use-visual-state';
import { isRefObject, type Ref } from '../../utils/is-ref-object.js';

/**
 * Creates a ref function that, when called, hydrates the provided
 * external ref and VisualElement.
 */
function useMotionRef<Instance, RenderState>(
	visualState: VisualState<Instance, RenderState>,
	visualElement?: VisualElement<Instance> | null,
	externalRef?: Ref<Instance>
): Ref<Instance> {
	return (instance) => {
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

export { useMotionRef };
