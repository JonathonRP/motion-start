/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { VariantLabels } from '../../motion/types';
import type { TargetAndTransition, TargetResolver } from '../../types';
import type { VisualElement } from '../types';
import type { AnimationOptions } from './animation';
import { AnimationType } from './types';
export interface AnimationState {
	animateChanges: (options?: AnimationOptions, type?: AnimationType) => Promise<any>;
	setActive: (type: AnimationType, isActive: boolean, options?: AnimationOptions) => Promise<any>;
	setAnimateFunction: (fn: any) => void;
	isAnimated(key: string): boolean;
	getState: () => {
		[key: string]: AnimationTypeState;
	};
}
export type AnimationList = string[] | TargetAndTransition[];
export interface AnimationTypeState {
	isActive: boolean;
	protectedKeys: {
		[key: string]: true;
	};
	needsAnimating: {
		[key: string]: boolean;
	};
	prevResolvedValues: {
		[key: string]: any;
	};
	prevProp?: VariantLabels | TargetAndTransition;
}

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { isAnimationControls } from '../../animation/utils/is-animation-controls.js';
import { isKeyframesTarget } from '../../animation/utils/is-keyframes-target.js';
import { shallowCompare } from '../../utils/shallow-compare.js';
import { animateVisualElement } from './animation.js';
import { isVariantLabel, isVariantLabels, resolveVariant } from './variants.js';

var variantPriorityOrder = [
	AnimationType.Animate,
	AnimationType.Hover,
	AnimationType.Tap,
	AnimationType.Drag,
	AnimationType.Focus,
	AnimationType.Exit,
] satisfies AnimationType[];
var reversePriorityOrder = [...variantPriorityOrder].reverse();
var numAnimationTypes = variantPriorityOrder.length;
function animateList(visualElement: VisualElement) {
	return (animations: any[]) =>
		Promise.all(
			animations.map((_a) => {
				var animation = _a.animation,
					options = _a.options;
				return animateVisualElement(visualElement, animation, options);
			})
		);
}
function createAnimationState(visualElement: VisualElement) {
	var animate = animateList(visualElement);
	var state = createState();
	var allAnimatedKeys = {};
	var isInitialRender = true;
	/**
	 * This function will be used to reduce the animation definitions for
	 * each active animation type into an object of resolved values for it.
	 */
	var buildResolvedTypeValues = (acc: any, definition: TargetAndTransition | TargetResolver) => {
		var resolved = resolveVariant(visualElement, definition);
		if (resolved) {
			var { transition: _, transitionEnd, ...target } = resolved;
			acc = Object.assign(Object.assign(Object.assign({}, acc), target), transitionEnd);
		}
		return acc;
	};
	function isAnimated(key: string | number) {
		return (allAnimatedKeys as any)[key] !== undefined;
	}
	/**
	 * This just allows us to inject mocked animation functions
	 * @internal
	 */
	function setAnimateFunction(makeAnimator: (arg0: VisualElement<any, any>) => (animations: any[]) => Promise<void[]>) {
		animate = makeAnimator(visualElement);
	}
	/**
	 * When we receive new props, we need to:
	 * 1. Create a list of protected keys for each type. This is a directory of
	 *    value keys that are currently being "handled" by types of a higher priority
	 *    so that whenever an animation is played of a given type, these values are
	 *    protected from being animated.
	 * 2. Determine if an animation type needs animating.
	 * 3. Determine if any values have been removed from a type and figure out
	 *    what to animate those to.
	 */
	function animateChanges(options: any, changedActiveType: any) {
		var _a;
		var props = visualElement.getProps();
		var context = visualElement.getVariantContext(true) || {};
		/**
		 * A list of animations that we'll build into as we iterate through the animation
		 * types. This will get executed at the end of the function.
		 */
		var animations: any[] = [];
		/**
		 * Keep track of which values have been removed. Then, as we hit lower priority
		 * animation types, we can check if they contain removed values and animate to that.
		 */
		var removedKeys = new Set();
		/**
		 * A dictionary of all encountered keys. This is an object to let us build into and
		 * copy it without iteration. Each time we hit an animation type we set its protected
		 * keys - the keys its not allowed to animate - to the latest version of this object.
		 */
		var encounteredKeys = {};
		/**
		 * If a variant has been removed at a given index, and this component is controlling
		 * variant animations, we want to ensure lower-priority variants are forced to animate.
		 */
		var removedVariantIndex = Number.POSITIVE_INFINITY;
		var _loop_1 = (i: number) => {
			var type = reversePriorityOrder[i];
			var typeState = state[type];
			var prop = (_a = props[type]) !== null && _a !== void 0 ? _a : context[type];
			var propIsVariant = isVariantLabel(prop);
			/**
			 * If this type has *just* changed isActive status, set activeDelta
			 * to that status. Otherwise set to null.
			 */
			var activeDelta = type === changedActiveType ? typeState.isActive : null;
			if (activeDelta === false) removedVariantIndex = i;
			/**
			 * If this prop is an inherited variant, rather than been set directly on the
			 * component itself, we want to make sure we allow the parent to trigger animations.
			 *
			 * TODO: Can probably change this to a !isControllingVariants check
			 */
			var isInherited = prop === context[type] && prop !== props[type] && propIsVariant;
			/**
			 *
			 */
			if (isInherited && isInitialRender && visualElement.manuallyAnimateOnMount) {
				isInherited = false;
			}
			/**
			 * Set all encountered keys so far as the protected keys for this type. This will
			 * be any key that has been animated or otherwise handled by active, higher-priortiy types.
			 */
			typeState.protectedKeys = Object.assign({}, encounteredKeys);
			// Check if we can skip analysing this prop early
			if (
				// If it isn't active and hasn't *just* been set as inactive
				(!typeState.isActive && activeDelta === null) ||
				// If we didn't and don't have any defined prop for this animation type
				(!prop && !typeState.prevProp) ||
				// Or if the prop doesn't define an animation
				isAnimationControls(prop) ||
				typeof prop === 'boolean'
			) {
				return 'continue';
			}
			/**
			 * As we go look through the values defined on this type, if we detect
			 * a changed value or a value that was removed in a higher priority, we set
			 * this to true and add this prop to the animation list.
			 */
			var shouldAnimateType =
				variantsHaveChanged(typeState.prevProp, prop) ||
				// If we're making this variant active, we want to always make it active
				(type === changedActiveType && typeState.isActive && !isInherited && propIsVariant) ||
				// If we removed a higher-priority variant (i is in reverse order)
				(i > removedVariantIndex && propIsVariant);
			/**
			 * As animations can be set as variant lists, variants or target objects, we
			 * coerce everything to an array if it isn't one already
			 */
			var definitionList = Array.isArray(prop) ? prop : [prop];
			/**
			 * Build an object of all the resolved values. We'll use this in the subsequent
			 * animateChanges calls to determine whether a value has changed.
			 */
			// @ts-expect-error
			var resolvedValues = definitionList.reduce(buildResolvedTypeValues, {});
			if (activeDelta === false) resolvedValues = {};
			/**
			 * Now we need to loop through all the keys in the prev prop and this prop,
			 * and decide:
			 * 1. If the value has changed, and needs animating
			 * 2. If it has been removed, and needs adding to the removedKeys set
			 * 3. If it has been removed in a higher priority type and needs animating
			 * 4. If it hasn't been removed in a higher priority but hasn't changed, and
			 *    needs adding to the type's protectedKeys list.
			 */
			var _b = typeState.prevResolvedValues,
				prevResolvedValues = _b === void 0 ? {} : _b;
			var allKeys = Object.assign(Object.assign({}, prevResolvedValues), resolvedValues);
			var markToAnimate = (key: string) => {
				shouldAnimateType = true;
				removedKeys.delete(key);
				typeState.needsAnimating[key] = true;
			};
			for (var key in allKeys) { 
				// @ts-expect-error
				var next = resolvedValues[key];
				var prev = prevResolvedValues[key];
				// If we've already handled this we can just skip ahead
				if (encounteredKeys.hasOwnProperty(key)) continue;
				/**
				 * If the value has changed, we probably want to animate it.
				 */
				if (next !== prev) {
					/**
					 * If both values are keyframes, we need to shallow compare them to
					 * detect whether any value has changed. If it has, we animate it.
					 */
					if (isKeyframesTarget(next) && isKeyframesTarget(prev)) {
						if (!shallowCompare(next, prev)) {
							markToAnimate(key);
						} else {
							/**
							 * If it hasn't changed, we want to ensure it doesn't animate by
							 * adding it to the list of protected keys.
							 */
							typeState.protectedKeys[key] = true;
						}
					} else if (next !== undefined) {
						// If next is defined and doesn't equal prev, it needs animating
						markToAnimate(key);
					} else {
						// If it's undefined, it's been removed.
						removedKeys.add(key);
					}
				} else if (next !== undefined && removedKeys.has(key)) {
					/**
					 * If next hasn't changed and it isn't undefined, we want to check if it's
					 * been removed by a higher priority
					 */
					markToAnimate(key);
				} else {
					/**
					 * If it hasn't changed, we add it to the list of protected values
					 * to ensure it doesn't get animated.
					 */
					typeState.protectedKeys[key] = true;
				}
			}
			/**
			 * Update the typeState so next time animateChanges is called we can compare the
			 * latest prop and resolvedValues to these.
			 */
			typeState.prevProp = prop;
			typeState.prevResolvedValues = resolvedValues;
			/**
			 *
			 */
			if (typeState.isActive) {
				encounteredKeys = Object.assign(Object.assign({}, encounteredKeys), resolvedValues);
			}
			if (isInitialRender && visualElement.blockInitialAnimation) {
				shouldAnimateType = false;
			}
			/**
			 * If this is an inherited prop we want to hard-block animations
			 * TODO: Test as this should probably still handle animations triggered
			 * by removed values?
			 */
			if (shouldAnimateType && !isInherited) {
				animations.push.apply(animations, [
					...definitionList.map((animation) => ({
						animation: animation,
						options: Object.assign({ type: type }, options),
					})),
				]);
			}
		};
		/**
		 * Iterate through all animation types in reverse priority order. For each, we want to
		 * detect which values it's handling and whether or not they've changed (and therefore
		 * need to be animated). If any values have been removed, we want to detect those in
		 * lower priority props and flag for animation.
		 */
		for (var i = 0; i < numAnimationTypes; i++) {
			_loop_1(i);
		}
		allAnimatedKeys = Object.assign({}, encounteredKeys);
		/**
		 * If there are some removed value that haven't been dealt with,
		 * we need to create a new animation that falls back either to the value
		 * defined in the style prop, or the last read value.
		 */
		if (removedKeys.size) {
			var fallbackAnimation_1 = {};
			removedKeys.forEach((key) => {
				var fallbackTarget = visualElement.getBaseTarget(key as string);
				if (fallbackTarget !== undefined) {
					//@ts-ignore
					fallbackAnimation_1[key] = fallbackTarget;
				}
			});
			animations.push({ animation: fallbackAnimation_1 });
		}
		var shouldAnimate = Boolean(animations.length);
		if (isInitialRender && props.initial === false && !visualElement.manuallyAnimateOnMount) {
			shouldAnimate = false;
		}
		isInitialRender = false;
		return shouldAnimate ? animate(animations) : Promise.resolve();
	}
	/**
	 * Change whether a certain animation type is active.
	 */
	function setActive(type: AnimationType, isActive: boolean, options: any) {
		var _a;
		// If the active state hasn't changed, we can safely do nothing here
		//@ts-ignore
		if (state[type].isActive === isActive) return Promise.resolve();
		// Propagate active change to children
		(_a = visualElement.variantChildren) === null || _a === void 0
			? void 0
			: _a.forEach((child) => {
					var _a;
					return (_a = child.animationState) === null || _a === void 0 ? void 0 : _a.setActive(type, isActive);
				});
		//@ts-ignore
		state[type].isActive = isActive;
		return animateChanges(options, type);
	}
	return {
		isAnimated: isAnimated,
		animateChanges: animateChanges,
		setActive: setActive,
		setAnimateFunction: setAnimateFunction,
		getState: () => state,
	} satisfies AnimationState;
}
function variantsHaveChanged(prev: any, next: any) {
	if (typeof next === 'string') {
		return next !== prev;
	}

	if (isVariantLabels(next)) {
		return !shallowCompare(next, prev);
	}

	return false;
}
function createTypeState(isActive = false): AnimationTypeState {
	return {
		isActive: isActive,
		protectedKeys: {},
		needsAnimating: {},
		prevResolvedValues: {},
	};
}
function createState() {
	var _a;
	return (
		(_a = {} as any),
		(_a[AnimationType.Animate] = createTypeState(true)),
		(_a[AnimationType.Hover] = createTypeState()),
		(_a[AnimationType.Tap] = createTypeState()),
		(_a[AnimationType.Drag] = createTypeState()),
		(_a[AnimationType.Focus] = createTypeState()),
		(_a[AnimationType.Exit] = createTypeState()),
		_a
	);
}

export { createAnimationState, variantPriorityOrder, variantsHaveChanged };
