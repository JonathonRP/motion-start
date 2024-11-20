/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MutableRefObject } from './safe-react-types';

export type Ref<T> = (instance: T | null) => void | {
	current: T | null;
} | null;

export function isRefObject<E = any>(ref: any): ref is MutableRefObject<E> {
	return ref && typeof ref === 'object' && Object.prototype.hasOwnProperty.call(ref, 'current');
}
