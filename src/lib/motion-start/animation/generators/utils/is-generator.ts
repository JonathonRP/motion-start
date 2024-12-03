/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { AnimationGeneratorType, GeneratorFactory } from '../../types';

export function isGenerator(type?: AnimationGeneratorType): type is GeneratorFactory {
	return typeof type === 'function';
}
