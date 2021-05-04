/** 
based on framer-motion@4.1.11,
Copyright (c) 2018 Framer B.V.
*/

import sync, { flushSync } from 'framesync';
import { withoutTreeTransform, batchResetAndMeasure } from '../../../render/dom/projection/utils.js';
import { compareByDepth } from '../../../render/utils/compare-by-depth.js';
import { Presence } from '../types.js';

/**
 * Default handlers for batching VisualElements
 */
var defaultHandler = {
    layoutReady: function (child) { return child.notifyLayoutReady(); },
};
/**
 * Create a batcher to process VisualElements
 */
function createBatcher() {
    var queue = new Set();
    return {
        add: function (child) { return queue.add(child); },
        flush: function (_a) {
            var _b = _a === void 0 ? defaultHandler : _a, layoutReady = _b.layoutReady, parent = _b.parent;
            var order = Array.from(queue).sort(compareByDepth);
            if (parent) {
                withoutTreeTransform(parent, function () {
                    batchResetAndMeasure(order);
                });
            }
            else {
                batchResetAndMeasure(order);
            }
            /**
             * Write: Notify the VisualElements they're ready for further write operations.
             */
            order.forEach(layoutReady);
            /**
             * After all children have started animating, ensure any Entering components are set to Present.
             * If we add deferred animations (set up all animations and then start them in two loops) this
             * could be moved to the start loop. But it needs to happen after all the animations configs
             * are generated in AnimateSharedLayout as this relies on presence data
             */
            order.forEach(function (child) {
                if (child.isPresent)
                    child.presence = Presence.Present;
            });
            /**
             * Starting these animations will have queued jobs on the frame loop. In some situations,
             * like when removing an element, these will be processed too late after the DOM is manipulated,
             * leaving a flash of incorrectly-projected content. By manually flushing these jobs
             * we ensure there's no flash.
             */
            flushSync.preRender();
            flushSync.render();
            /**
             * Schedule a callback at the end of the following frame to assign the latest projection
             * box to the prevViewportBox snapshot. Once global batching is in place this could be run
             * synchronously. But for now it ensures that if any nested `AnimateSharedLayout` top-level
             * child attempts to calculate its previous relative position against a prevViewportBox
             * it will be against its latest projection box instead, as the snapshot is useless beyond this
             * render.
             */
            sync.postRender(function () { return order.forEach(assignProjectionToSnapshot); });
            queue.clear();
        },
    };
}
function assignProjectionToSnapshot(child) {
    child.prevViewportBox = child.projection.target;
}

export { createBatcher };
