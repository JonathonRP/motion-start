/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { acceleratedValues } from '../../animation/animators/utils/accelerated-values.js';
import { camelToDash } from '../../render/dom/utils/camel-to-dash.js';
import { transformProps } from '../../render/html/utils/transform.js';

export function getWillChangeName(name: string): string | undefined {
	if (transformProps.has(name)) {
		return 'transform';
	} else if (acceleratedValues.has(name)) {
		return camelToDash(name);
	}
}
