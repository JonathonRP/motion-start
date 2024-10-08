/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { ResolvedValues, VisualElement } from "../types";
import type { LayoutState, TargetProjection } from "./state";

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { resetBox, applyTreeDeltas } from '../../utils/geometry/delta-apply.js';
import { updateBoxDelta } from '../../utils/geometry/delta-calc.js';

function updateLayoutDeltas({ delta, layout, layoutCorrected, treeScale }: LayoutState, { target }: TargetProjection, treePath: VisualElement[], transformOrigin: ResolvedValues) {
    /**
     * Reset the corrected box with the latest values from box, as we're then going
     * to perform mutative operations on it.
     */
    resetBox(layoutCorrected, layout);
    /**
     * Apply all the parent deltas to this box to produce the corrected box. This
     * is the layout box, as it will appear on screen as a result of the transforms of its parents.
     */
    applyTreeDeltas(layoutCorrected, treeScale, treePath);
    /**
     * Update the delta between the corrected box and the target box before user-set transforms were applied.
     * This will allow us to calculate the corrected borderRadius and boxShadow to compensate
     * for our layout reprojection, but still allow them to be scaled correctly by the user.
     * It might be that to simplify this we may want to accept that user-set scale1 is also corrected
     * and we wouldn't have to keep and calc both deltas, OR we could support a user setting
     * to allow people to choose whether these styles are corrected based on just the
     * layout reprojection or the final bounding box.
     */
    updateBoxDelta(delta, layoutCorrected, target, transformOrigin);
}

export { updateLayoutDeltas };
