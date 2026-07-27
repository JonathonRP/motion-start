/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

export { HTMLProjectionNode } from './projection/node/HTMLProjectionNode.js';
export { nodeGroup } from './projection/node/group.js';
export { calcBoxDelta } from './projection/geometry/delta-calc.js';

/**
 * For debugging purposes
 */
import { frame, frameData } from './frameloop/index.js';
import { mix } from './utils/mix/index.js';
import { animateValue } from './animation/animators/MainThreadAnimation.js';
export { frame, animateValue as animate, mix, frameData };
export { buildTransform } from './render/html/utils/build-transform.js';
export { addScaleCorrector } from './projection/styles/scale-correction.js';
export { correctBorderRadius } from './projection/styles/scale-border-radius.js';
export { correctBoxShadow } from './projection/styles/scale-box-shadow.js';
export { HTMLVisualElement } from './render/html/HTMLVisualElement.js';
