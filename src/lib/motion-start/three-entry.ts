/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

export type {
	ResolvedValues,
	ScrapeMotionValuesFromProps,
} from './render/types.js';

export { AnimationType } from './render/utils/types.js';
export { animations } from './motion/features/animations.js';
export type { MotionContext } from './context/MotionContext/index.js';
export { createBox } from './projection/geometry/models.js';
export { calcLength } from './projection/geometry/delta-calc.js';
export { filterProps } from './render/dom/utils/filter-props.js';
export {
	makeUseVisualState,
	type VisualState,
} from './motion/utils/use-visual-state.svelte.js';
export { isDragActive } from './gestures/drag/utils/lock.js';
export { addPointerEvent } from './events/add-pointer-event.js';
export { addPointerInfo } from './events/event-info.js';
export { isMotionValue } from './value/utils/is-motion-value.js';
export { isBrowser } from './utils/is-browser.js';
export { useForceUpdate } from './utils/use-force-update.svelte.js';
