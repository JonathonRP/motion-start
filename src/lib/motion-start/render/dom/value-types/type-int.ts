/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { number } from 'style-value-types';
/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import { fixed } from '../../../utils/fix-process-env';

var int = Object.assign(Object.assign({}, number), { transform: Math.round }) as {
	transform: (x: number) => number;
	test: (v: any) => boolean;
	parse: (v: any) => any;
	createTransformer?: ((template: string) => import('style-value-types').Transformer) | undefined;
	default?: any;
	getAnimatableNone?: ((v: any) => any) | undefined;
};

export { int };
