/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { Target, TargetWithKeyframes } from '../../../types';
import type { VisualElement } from '../../types';
/**
 * Parse Framer's special CSS variable format into a CSS token and a fallback.
 *
 * ```
 * `var(--foo, #fff)` => [`--foo`, '#fff']
 * ```
 *
 * @param current
 */
// export declare const cssVariableRegex: RegExp;
// export declare function parseCSSVariable(current: string): string[] | undefined[];
/**
 * Resolve CSS variables from
 *
 * @internal
 */
// export declare function resolveCSSVariables(): ;

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
// import { invariant } from '../../../utils/errors.js';

function isCSSVariable(value: string) {
	return typeof value === 'string' && value.startsWith('var(--');
}
/**
 * Parse Framer's special CSS variable format into a CSS token and a fallback.
 *
 * ```
 * `var(--foo, #fff)` => [`--foo`, '#fff']
 * ```
 *
 * @param current
 */
var cssVariableRegex = /var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/;
function parseCSSVariable(current: string): string[] | undefined[] {
	var match = cssVariableRegex.exec(current);
	if (!match) return [,];
	var [_, token, fallback] = match;
	return [token, fallback];
}
var maxDepth = 4;
function getVariableValue(current: string, element: Element, depth?: number | undefined) {
	if (depth === void 0) {
		depth = 1;
	}
	//invariant(depth <= maxDepth, "Max CSS variable fallback depth detected in property \"" + current + "\". This may indicate a circular fallback dependency.");
	var [token, fallback] = parseCSSVariable(current);
	// No CSS variable detected
	if (!token) return;
	// Attempt to read this CSS variable off the element
	var resolved = window.getComputedStyle(element).getPropertyValue(token);
	if (resolved) {
		return resolved.trim();
	} else if (isCSSVariable(fallback as string)) {
		// The fallback might itself be a CSS variable, in which case we attempt to resolve it too.
		return getVariableValue(fallback as string, element, depth + 1);
	} else {
		return fallback;
	}
}
/**
 * Resolve CSS variables from
 *
 * @internal
 */
function resolveCSSVariables(
	visualElement: VisualElement,
	{ ...target }: TargetWithKeyframes,
	transitionEnd: Target | undefined
): {
	target: TargetWithKeyframes;
	transitionEnd?: Target;
} {
	var element = visualElement.getInstance();
	if (!(element instanceof HTMLElement)) return { target: target, transitionEnd: transitionEnd };
	// If `transitionEnd` isn't `undefined`, clone it. We could clone `target` and `transitionEnd`
	// only if they change but I think this reads clearer and this isn't a performance-critical path.
	if (transitionEnd) {
		transitionEnd = Object.assign({}, transitionEnd);
	}
	// Go through existing `MotionValue`s and ensure any existing CSS variables are resolved
	visualElement.forEachValue((value) => {
		var current = value.get();
		if (!isCSSVariable(current)) return;
		var resolved = getVariableValue(current, element);
		if (resolved) value.set(resolved);
	});
	// Cycle through every target property and resolve CSS variables. Currently
	// we only read single-var properties like `var(--foo)`, not `calc(var(--foo) + 20px)`
	for (var key in target) {
		//@ts-ignore
		var current = target[key];
		if (!isCSSVariable(current)) continue;
		var resolved = getVariableValue(current, element);
		if (!resolved) continue;
		// Clone target if it hasn't already been
		//@ts-ignore
		target[key] = resolved;
		// If the user hasn't already set this key on `transitionEnd`, set it to the unresolved
		// CSS variable. This will ensure that after the animation the component will reflect
		// changes in the value of the CSS variable.
		if (transitionEnd)
			//@ts-ignore
			(_b = transitionEnd[key]) !== null && _b !== void 0 ? _b : (transitionEnd[key] = current);
	}
	return { target: target, transitionEnd: transitionEnd };
}

export { cssVariableRegex, parseCSSVariable, resolveCSSVariables };
