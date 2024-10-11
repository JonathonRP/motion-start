/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { SharedLayoutAnimationConfig } from '../../components/AnimateSharedLayout/types';
import type { MotionProps } from '../../motion/types';
import type { AxisBox2D, BoxDelta } from '../../types/geometry';
import type { ResolvedValues } from '../types';
import type { AnimationDefinition } from './animation';
export type LayoutMeasureListener = (layout: AxisBox2D, prevLayout: AxisBox2D) => void;
export type BeforeLayoutMeasureListener = (layout: AxisBox2D) => void;
export type LayoutUpdateListener = (
	layout: AxisBox2D,
	prevLayout: AxisBox2D,
	config?: SharedLayoutAnimationConfig
) => void;
export type UpdateListener = (latest: ResolvedValues) => void;
export type AnimationStartListener = () => void;
export type AnimationCompleteListener = (definition: AnimationDefinition) => void;
export type LayoutAnimationCompleteListener = () => void;
export type SetAxisTargetListener = () => void;
export type RenderListener = () => void;
export type OnViewportBoxUpdate = (box: AxisBox2D, delta: BoxDelta) => void;
/**
 * TODO: Make more of these lifecycle events available as props
 */
export interface VisualElementLifecycles {
	/**
	 * A callback that fires whenever the viewport-relative bounding box updates.
	 *
	 * @public
	 */
	onViewportBoxUpdate?(box: AxisBox2D, delta: BoxDelta): void;
	onBeforeLayoutMeasure?(box: AxisBox2D): void;
	onLayoutMeasure?(box: AxisBox2D, prevBox: AxisBox2D): void;
	/**
	 * Callback with latest motion values, fired max once per frame.
	 *
	 * @motion
	 *
	 * ```jsx
	 * function onUpdate(latest) {
	 *   console.log(latest.x, latest.opacity)
	 * }
	 *
	 * <MotionDiv animate={{ x: 100, opacity: 0 }} onUpdate={onUpdate} />
	 * ```
	 */
	onUpdate?(latest: ResolvedValues): void;
	/**
	 * Callback when animation defined in `animate` begins.
	 *
	 * @motion
	 *
	 * ```jsx
	 * function onStart() {
	 *   console.log("Animation started")
	 * }
	 *
	 * <MotionDiv animate={{ x: 100 }} onAnimationStart={onStart} />
	 * ```
	 */
	onAnimationStart?(): void;
	/**
	 * Callback when animation defined in `animate` is complete.
	 *
	 * The provided callback will be called the triggering animation definition.
	 * If this is a variant, it'll be the variant name, and if a target object
	 * then it'll be the target object.
	 *
	 * This way, it's possible to figure out which animation has completed.
	 *
	 * @motion
	 *
	 * ```jsx
	 * function onComplete() {
	 *   console.log("Animation completed")
	 * }
	 *
	 * <MotionDiv
	 *   animate={{ x: 100 }}
	 *   onAnimationComplete={definition => {
	 *     console.log('Completed animating', definition)
	 *   }}
	 * />
	 * ```
	 */
	onAnimationComplete?(definition: AnimationDefinition): void;
	/**
	 * @internal
	 */
	onLayoutAnimationComplete?(): void;
	/**
	 * @internal
	 */
	onUnmount?(): void;
}
export interface LifecycleManager {
	onLayoutMeasure: (callback: LayoutMeasureListener) => () => void;
	notifyLayoutMeasure: LayoutMeasureListener;
	onBeforeLayoutMeasure: (callback: BeforeLayoutMeasureListener) => () => void;
	notifyBeforeLayoutMeasure: BeforeLayoutMeasureListener;
	onLayoutUpdate: (callback: LayoutUpdateListener) => () => void;
	notifyLayoutUpdate: LayoutUpdateListener;
	onViewportBoxUpdate: (callback: OnViewportBoxUpdate) => () => void;
	notifyViewportBoxUpdate: OnViewportBoxUpdate;
	onUpdate: (callback: UpdateListener) => () => void;
	notifyUpdate: UpdateListener;
	onAnimationStart: (callback: AnimationStartListener) => () => void;
	notifyAnimationStart: AnimationStartListener;
	onAnimationComplete: (callback: AnimationCompleteListener) => () => void;
	notifyAnimationComplete: AnimationCompleteListener;
	onLayoutAnimationComplete: (callback: LayoutAnimationCompleteListener) => () => void;
	notifyLayoutAnimationComplete: LayoutAnimationCompleteListener;
	onSetAxisTarget: (callback: SetAxisTargetListener) => () => void;
	notifySetAxisTarget: SetAxisTargetListener;
	onRender: (callback: RenderListener) => () => void;
	notifyRender: RenderListener;
	onUnmount: (callback: () => void) => () => void;
	notifyUnmount: () => void;
	clearAllListeners: () => void;
	updatePropListeners: (props: MotionProps) => void;
}

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { SubscriptionManager } from '../../utils/subscription-manager.js';

var names = [
	'LayoutMeasure',
	'BeforeLayoutMeasure',
	'LayoutUpdate',
	'ViewportBoxUpdate',
	'Update',
	'Render',
	'AnimationComplete',
	'LayoutAnimationComplete',
	'AnimationStart',
	'SetAxisTarget',
	'Unmount',
];
function createLifecycles(...args: any[]) {
	var managers = names.map(() => new SubscriptionManager());
	var propSubscriptions = {};
	var lifecycles = {
		clearAllListeners: () => managers.forEach((manager) => manager.clear()),
		updatePropListeners: (props: { [x: string]: any }) =>
			names.forEach((name) => {
				var _a;
				// @ts-expect-error
				(_a = propSubscriptions[name]) === null || _a === void 0 ? void 0 : _a.call(propSubscriptions);
				var on = 'on' + name;
				var propListener = props[on];
				if (propListener) {// @ts-expect-error
					propSubscriptions[name] = (lifecycles as any)[on](propListener);
				}
			}),
	} as any;
	managers.forEach((manager, i) => {
		lifecycles['on' + names[i]] = (handler: (...args: any) => void) => manager.add(handler);
		lifecycles['notify' + names[i]] = () => {
			const [arg1, arg2, arg3] = args;
			return manager.notify.apply(manager, [arg1, arg2, arg3]);
		};
	});
	return lifecycles satisfies LifecycleManager;
}

export { createLifecycles };
