/**
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { CreateVisualElement } from '../render/types';

export interface LazyContextProps {
    renderer?: CreateVisualElement<any>;
    strict: boolean;
}

import { getDomContext } from './DOMcontext';

/**
 * Context key for Lazy
 * @internal
 */
export const LAZY_CONTEXT_KEY = Symbol('LazyContext');

/**
 * @internal
 */
const LazyContext = (c?: any): LazyContextProps => {
    const domContext = getDomContext('Lazy', c);
    return (domContext || { strict: false }) as LazyContextProps;
};

export { LazyContext };
