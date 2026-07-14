/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { DOMKeyframesDefinition } from '../types';

export function isDOMKeyframes(keyframes: unknown): keyframes is DOMKeyframesDefinition {
	return typeof keyframes === 'object' && !Array.isArray(keyframes);
}
