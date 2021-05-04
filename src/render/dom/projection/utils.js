/** 
based on framer-motion@4.1.11,
Copyright (c) 2018 Framer B.V.
*/

import sync from 'framesync';
import { copyAxisBox } from '../../../utils/geometry/index.js';
import { compareByDepth } from '../../utils/compare-by-depth.js';

function updateTreeLayoutMeasurements(visualElement, isRelativeDrag) {
    withoutTreeTransform(visualElement, function () {
        var allChildren = collectProjectingChildren(visualElement);
        batchResetAndMeasure(allChildren);
        updateLayoutMeasurement(visualElement);
    });
    !isRelativeDrag &&
        visualElement.rebaseProjectionTarget(true, visualElement.measureViewportBox(false));
}
function collectProjectingChildren(visualElement) {
    var children = [];
    var addChild = function (child) {
        if (child.projection.isEnabled || child.shouldResetTransform()) {
            children.push(child);
        }
        child.children.forEach(addChild);
    };
    visualElement.children.forEach(addChild);
    return children.sort(compareByDepth);
}
/**
 * Perform the callback after temporarily unapplying the transform
 * upwards through the tree.
 */
function withoutTreeTransform(visualElement, callback) {
    var parent = visualElement.parent;
    var isEnabled = visualElement.projection.isEnabled;
    var shouldReset = isEnabled || visualElement.shouldResetTransform();
    shouldReset && visualElement.resetTransform();
    parent ? withoutTreeTransform(parent, callback) : callback();
    shouldReset && visualElement.restoreTransform();
}
/**
 * Update the layoutState by measuring the DOM layout. This
 * should be called after resetting any layout-affecting transforms.
 */
function updateLayoutMeasurement(visualElement) {
    if (visualElement.shouldResetTransform())
        return;
    var layoutState = visualElement.getLayoutState();
    visualElement.notifyBeforeLayoutMeasure(layoutState.layout);
    layoutState.isHydrated = true;
    layoutState.layout = visualElement.measureViewportBox();
    layoutState.layoutCorrected = copyAxisBox(layoutState.layout);
    visualElement.notifyLayoutMeasure(layoutState.layout, visualElement.prevViewportBox || layoutState.layout);
    sync.update(function () { return visualElement.rebaseProjectionTarget(); });
}
/**
 * Record the viewport box as it was before an expected mutation/re-render
 */
function snapshotViewportBox(visualElement) {
    if (visualElement.shouldResetTransform())
        return;
    visualElement.prevViewportBox = visualElement.measureViewportBox(false);
    /**
     * Update targetBox to match the prevViewportBox. This is just to ensure
     * that targetBox is affected by scroll in the same way as the measured box
     */
    visualElement.rebaseProjectionTarget(false, visualElement.prevViewportBox);
}
function batchResetAndMeasure(order) {
    /**
     * Write: Reset any transforms on children elements so we can read their actual layout
     */
    order.forEach(function (child) { return child.resetTransform(); });
    /**
     * Read: Measure the actual layout
     */
    order.forEach(updateLayoutMeasurement);
}

export { batchResetAndMeasure, collectProjectingChildren, snapshotViewportBox, updateLayoutMeasurement, updateTreeLayoutMeasurements, withoutTreeTransform };
