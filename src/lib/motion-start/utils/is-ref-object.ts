/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

export function isRefObject<E = any>(ref: any): ref is { current: E } {
	return ref && typeof ref === 'object' && Object.prototype.hasOwnProperty.call(ref, 'current');
}
