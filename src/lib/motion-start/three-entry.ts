/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

export type {
	ResolvedValues,
	ScrapeMotionValuesFromProps,
} from './render/types';

export { AnimationType } from './render/utils/types';
export { animations } from './motion/features/animations';
export { MotionContext } from './context/MotionContext';
export { createBox } from './projection/geometry/models';
export { calcLength } from './projection/geometry/delta-calc';
export { filterProps } from './render/dom/utils/filter-props';
export {
	makeUseVisualState,
	type VisualState,
} from './motion/utils/use-visual-state';
export { isDragActive } from './gestures/drag/utils/lock';
export { addPointerEvent } from './events/add-pointer-event';
export { addPointerInfo } from './events/event-info';
export { isMotionValue } from './value/utils/is-motion-value';
export { isBrowser } from './utils/is-browser';
export { useForceUpdate } from './utils/use-force-update';
