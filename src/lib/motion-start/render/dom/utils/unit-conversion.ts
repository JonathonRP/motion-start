/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { Target, TargetWithKeyframes, Transition } from '../../../types';
import type { VisualElement } from '../../types';
enum BoundingBoxDimension {
	width = 'width',
	height = 'height',
	left = 'left',
	right = 'right',
	top = 'top',
	bottom = 'bottom',
}

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { fixed } from '../../../utils/fix-process-env.js';
import { number, px, type ValueType } from 'style-value-types';
import { isKeyframesTarget } from '../../../animation/utils/is-keyframes-target.js';
// import { invariant } from '../../../utils/errors.js';
import { transformProps } from '../../html/utils/transform.js';
import { findDimensionValueType } from '../value-types/dimensions.js';
import type { MotionValue } from '../../../index.js';
import type { AxisBox2D, BoundingBox2D } from '../../../types/geometry';
import type { TargetProjection } from '../../utils/state.js';

var positionalKeys = new Set(['width', 'height', 'top', 'left', 'right', 'bottom', 'x', 'y']);
var isPositionalKey = (key: string) => positionalKeys.has(key);
var hasPositionalKey = (target: any) => Object.keys(target).some(isPositionalKey);
var setAndResetVelocity = (value: MotionValue, to: any) => {
	// Looks odd but setting it twice doesn't render, it'll just
	// set both prev and current to the latest value
	value.set(to, false);
	value.set(to);
};
var isNumOrPxType = (v: ValueType | undefined) => v === number || v === px;
var getPosFromMatrix = (matrix: string, pos: number) => Number.parseFloat(matrix.split(', ')[pos]);
var getTranslateFromMatrix = (pos2: number, pos3: number) => (_bbox: BoundingBox2D, _a: { transform: string }) => {
	// @ts-expect-error
	varm = _a.transform; // @ts-expect-error
	if (transform === 'none' || !transform) return 0; // @ts-expect-error
	var matrix3d = transform.match(/^matrix3d\((.+)\)$/);
	if (matrix3d) {
		return getPosFromMatrix(matrix3d[1], pos3);
	} else {
		// @ts-expect-error
		var matrix = transform.match(/^matrix\((.+)\)$/);
		if (matrix) {
			return getPosFromMatrix(matrix[1], pos2);
		} else {
			return 0;
		}
	}
};
var transformKeys = new Set(['x', 'y', 'z']);
var nonTranslationalTransformKeys = transformProps.filter((key) => !transformKeys.has(key));
function removeNonTranslationalTransform(visualElement: VisualElement) {
	var removedTransforms: any[] = [];
	nonTranslationalTransformKeys.forEach((key) => {
		var value = visualElement.getValue(key);
		if (value !== undefined) {
			removedTransforms.push([key, value.get()]);
			value.set(key.startsWith('scale') ? 1 : 0);
		}
	});
	// Apply changes to element before measurement
	if (removedTransforms.length) visualElement.syncRender();
	return removedTransforms;
}
var positionalValues = {
	// Dimensions
	width: (_a: AxisBox2D) => {
		var x = _a.x;
		return x.max - x.min;
	},
	height: (_a: AxisBox2D) => {
		var y = _a.y;
		return y.max - y.min;
	},
	top: (_bbox: BoundingBox2D, _a: BoundingBox2D) => {
		var top = _a.top;
		return top;
	},
	left: (_bbox: BoundingBox2D, _a: BoundingBox2D) => {
		var left = _a.left;
		return left;
	},
	bottom: (_a: AxisBox2D, _b: BoundingBox2D) => {
		var y = _a.y;
		var top = _b.top;
		return top + (y.max - y.min);
	},
	right: (_a: AxisBox2D, _b: BoundingBox2D) => {
		var x = _a.x;
		var left = _b.left;
		return left + (x.max - x.min);
	},
	// Transform
	x: getTranslateFromMatrix(4, 13),
	y: getTranslateFromMatrix(5, 14),
};
var convertChangedValueTypes = (
	target: { [x: string]: any; display: any },
	visualElement: VisualElement,
	changedKeys: string[]
) => {
	var originBbox = visualElement.measureViewportBox();
	var element = visualElement.getInstance();
	var elementComputedStyle = getComputedStyle(element);
	var display = elementComputedStyle.display,
		top = elementComputedStyle.top,
		left = elementComputedStyle.left,
		bottom = elementComputedStyle.bottom,
		right = elementComputedStyle.right,
		transform = elementComputedStyle.transform;
	var originComputedStyle = { top: top, left: left, bottom: bottom, right: right, transform: transform };
	// If the element is currently set to display: "none", make it visible before
	// measuring the target bounding box
	if (display === 'none') {
		visualElement.setStaticValue('display', target.display || 'block');
	}
	// Apply the latest values (as set in checkAndConvertChangedValueTypes)
	visualElement.syncRender();
	var targetBbox = visualElement.measureViewportBox();
	changedKeys.forEach((key) => {
		// Restore styles to their **calculated computed style**, not their actual
		// originally set style. This allows us to animate between equivalent pixel units.
		var value = visualElement.getValue(key);
		//@ts-ignore
		setAndResetVelocity(value!, positionalValues[key](originBbox, originComputedStyle));
		//@ts-ignore
		target[key] = positionalValues[key](targetBbox, elementComputedStyle);
	});
	return target;
};
var checkAndConvertChangedValueTypes = (visualElement: VisualElement, target: any, origin: any, transitionEnd: any) => {
	if (origin === void 0) {
		origin = {};
	}
	if (transitionEnd === void 0) {
		transitionEnd = {};
	}
	target = Object.assign({}, target);
	transitionEnd = Object.assign({}, transitionEnd);
	var targetPositionalKeys = Object.keys(target).filter(isPositionalKey);
	// We want to remove any transform values that could affect the element's bounding box before
	// it's measured. We'll reapply these later.
	var removedTransformValues: any[] = [];
	var hasAttemptedToRemoveTransformValues = false;
	var changedValueTypeKeys: string[] = [];
	targetPositionalKeys.forEach((key) => {
		var value = visualElement.getValue(key);
		if (!visualElement.hasValue(key)) return;
		var from = origin[key];
		var to = target[key];
		var fromType = findDimensionValueType(from);
		var toType;
		// TODO: The current implementation of this basically throws an error
		// if you try and do value conversion via keyframes. There's probably
		// a way of doing this but the performance implications would need greater scrutiny,
		// as it'd be doing multiple resize-remeasure operations.
		if (isKeyframesTarget(to)) {
			var numKeyframes = to.length;
			for (var i = to[0] === null ? 1 : 0; i < numKeyframes; i++) {
				if (!toType) {
					toType = findDimensionValueType(to[i]);
					//invariant(toType === fromType ||
					//    (isNumOrPxType(fromType) && isNumOrPxType(toType)), "Keyframes must be of the same dimension as the current value");
				}
				//else {
				///    invariant(findDimensionValueType(to[i]) === toType, "All keyframes must be of the same type");
				//}
			}
		} else {
			toType = findDimensionValueType(to);
		}
		if (fromType !== toType) {
			// If they're both just number or px, convert them both to numbers rather than
			// relying on resize/remeasure to convert (which is wasteful in this situation)
			if (isNumOrPxType(fromType) && isNumOrPxType(toType)) {
				var current: MotionValue = value?.get();
				if (typeof current === 'string') {
					value?.set(Number.parseFloat(current));
				}
				if (typeof to === 'string') {
					target[key] = Number.parseFloat(to);
				} else if (Array.isArray(to) && toType === px) {
					target[key] = to.map(Number.parseFloat);
				}
			} else if (
				(fromType === null || fromType === void 0 ? void 0 : fromType.transform) &&
				(toType === null || toType === void 0 ? void 0 : toType.transform) &&
				(from === 0 || to === 0)
			) {
				// If one or the other value is 0, it's safe to coerce it to the
				// type of the other without measurement
				if (from === 0) {
					// @ts-ignore
					value?.set(toType?.transform(from));
				} else {
					// @ts-ignore
					target[key] = fromType?.transform(to);
				}
			} else {
				// If we're going to do value conversion via DOM measurements, we first
				// need to remove non-positional transform values that could affect the bbox measurements.
				if (!hasAttemptedToRemoveTransformValues) {
					removedTransformValues = removeNonTranslationalTransform(visualElement);
					hasAttemptedToRemoveTransformValues = true;
				}
				changedValueTypeKeys.push(key);
				transitionEnd[key] = transitionEnd[key] !== undefined ? transitionEnd[key] : target[key];
				setAndResetVelocity(value as MotionValue, to);
			}
		}
	});
	if (changedValueTypeKeys.length) {
		var convertedTarget = convertChangedValueTypes(target, visualElement, changedValueTypeKeys);
		// If we removed transform values, reapply them before the next render
		if (removedTransformValues.length) {
			removedTransformValues.forEach((_a) => {
				var [key, value] = _a;
				visualElement!.getValue(key)!.set(value);
			});
		}
		// Reapply original values
		visualElement.syncRender();
		return { target: convertedTarget, transitionEnd: transitionEnd };
	} else {
		return { target: target, transitionEnd: transitionEnd };
	}
};
/**
 * Convert value types for x/y/width/height/top/left/bottom/right
 *
 * Allows animation between `'auto'` -> `'100%'` or `0` -> `'calc(50% - 10vw)'`
 *
 * @internal
 */
function unitConversion(
	visualElement: VisualElement,
	target: TargetWithKeyframes,
	origin?: Target,
	transitionEnd?: Target
): {
	target: TargetWithKeyframes;
	transitionEnd?: Target;
} {
	return hasPositionalKey(target)
		? checkAndConvertChangedValueTypes(visualElement, target, origin, transitionEnd)
		: { target: target, transitionEnd: transitionEnd };
}

export { BoundingBoxDimension, unitConversion };
