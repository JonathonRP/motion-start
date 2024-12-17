/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

export { HTMLProjectionNode } from './projection/node/HTMLProjectionNode.svelte';
export { nodeGroup } from './projection/node/group.svelte';
export { calcBoxDelta } from './projection/geometry/delta-calc.svelte';

/**
 * For debugging purposes
 */
import { frame, frameData } from './frameloop';
import { mix } from './utils/mix';
import { animateValue } from './animation/animators/MainThreadAnimation.svelte';
export { frame, animateValue as animate, mix, frameData };
export { buildTransform } from './render/html/utils/build-transform';
export { addScaleCorrector } from './projection/styles/scale-correction.svelte';
export { correctBorderRadius } from './projection/styles/scale-border-radius.svelte';
export { correctBoxShadow } from './projection/styles/scale-box-shadow.svelte';
export { HTMLVisualElement } from './render/html/HTMLVisualElement.svelte';
