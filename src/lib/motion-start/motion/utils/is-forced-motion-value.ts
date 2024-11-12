/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { scaleCorrectors } from '../../projection/styles/scale-correction';
import type { MotionProps } from '../..';
import { transformProps } from '../../render/html/utils/transform';

export function isForcedMotionValue(key: string, { layout, layoutId }: MotionProps) {
	return (
		transformProps.has(key) ||
		key.startsWith('origin') ||
		((layout || layoutId !== undefined) && (!!scaleCorrectors[key] || key === 'opacity'))
	);
}
