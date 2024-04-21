/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import {fixed} from '../../../utils/fix-process-env';
import { __assign } from 'tslib';
import { number } from 'style-value-types';

var int = __assign(__assign({}, number), { transform: Math.round }) as {
    transform: (x: number) => number;
    test: (v: any) => boolean;
    parse: (v: any) => any;
    createTransformer?: ((template: string) => import("style-value-types").Transformer) | undefined;
    default?: any;
    getAnimatableNone?: ((v: any) => any) | undefined;
};

export { int };
