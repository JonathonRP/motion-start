/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { invariant } from '../../utils/errors.js';
import { cubicBezier } from '../../easing/cubic-bezier.js';
import { noop } from '../../utils/noop.js';
import { easeIn, easeInOut, easeOut } from '../../easing/ease.js';
import { circIn, circInOut, circOut } from '../../easing/circ.js';
import { backIn, backInOut, backOut } from '../../easing/back.js';
import { anticipate } from '../../easing/anticipate.js';
import type { Easing } from '../../easing/types.js';
import { isBezierDefinition } from './is-bezier-definition.js';

const easingLookup = {
	linear: noop,
	easeIn,
	easeInOut,
	easeOut,
	circIn,
	circInOut,
	circOut,
	backIn,
	backInOut,
	backOut,
	anticipate,
};

export const easingDefinitionToFunction = (definition: Easing) => {
	if (isBezierDefinition(definition)) {
		// If cubic bezier definition, create bezier curve
		invariant(definition.length === 4, 'Cubic bezier arrays must contain four numerical values.');

		const [x1, y1, x2, y2] = definition;
		return cubicBezier(x1, y1, x2, y2);
	} else if (typeof definition === 'string') {
		// Else lookup from table
		invariant(easingLookup[definition] !== undefined, `Invalid easing type '${definition}'`);
		return easingLookup[definition];
	}

	return definition;
};
