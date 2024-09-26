/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { VisualElement } from "../../render/types";
import type { VisualState } from "./use-visual-state";


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/

import { isRefObject } from '../../utils/is-ref-object.js';

/**
 * Creates a ref function that, when called, hydrates the provided
 * external ref and VisualElement.
 */
function useMotionRef<Instance, RenderState>(visualState: VisualState<Instance, RenderState>, visualElement?: VisualElement<Instance> | null, externalRef?: React.Ref<Instance>): React.Ref<Instance> {
    return function (instance) {
        var _a;
        instance && ((_a = visualState.mount) === null || _a === void 0 ? void 0 : _a.call(visualState, instance));
        if (visualElement) {
            instance
                ? visualElement.mount(instance)
                : visualElement.unmount();
        }
        if (externalRef) {
            if (typeof externalRef === "function") {
                externalRef(instance);
            }
            else if (isRefObject(externalRef)) {
                externalRef.current = instance;
            }
        }
    }
}

export { useMotionRef };

