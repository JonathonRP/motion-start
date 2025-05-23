/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
// TODO: import type { EasingFunction } from "svelte/transition"; future idea, maybe use svelte built in easing function...
import type { Easing, EasingFunction } from '../../types';
// export declare const easingDefinitionToFunction: (definition: Easing) => import("../../types").EasingFunction;
// export declare const isEasingArray: (ease: any) => ease is Easing[];

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import {
	anticipate,
	backIn,
	backInOut,
	backOut,
	bounceIn,
	bounceInOut,
	bounceOut,
	circIn,
	circInOut,
	circOut,
	cubicBezier,
	easeIn,
	easeInOut,
	easeOut,
	linear,
} from 'popmotion';
// import { invariant } from '../../utils/errors.js';

var easingLookup = {
	linear: linear,
	easeIn: easeIn,
	easeInOut: easeInOut,
	easeOut: easeOut,
	circIn: circIn,
	circInOut: circInOut,
	circOut: circOut,
	backIn: backIn,
	backInOut: backInOut,
	backOut: backOut,
	anticipate: anticipate,
	bounceIn: bounceIn,
	bounceInOut: bounceInOut,
	bounceOut: bounceOut,
};
var easingDefinitionToFunction = (definition: Easing): EasingFunction => {
	if (Array.isArray(definition)) {
		// If cubic bezier definition, create bezier curve
		//invariant(definition.length === 4, "Cubic bezier arrays must contain four numerical values.");
		var [x1, y1, x2, y2] = definition;
		return cubicBezier(x1, y1, x2, y2);
	} else if (typeof definition === 'string') {
		// Else lookup from table
		//invariant(easingLookup[definition] !== undefined, "Invalid easing type '" + definition + "'");
		return easingLookup[definition];
	}
	return definition;
};
const isEasingArray = (ease: Easing[] | any): ease is Easing[] => {
	return Array.isArray(ease) && typeof ease[0] !== 'number';
};

export { easingDefinitionToFunction, isEasingArray };
