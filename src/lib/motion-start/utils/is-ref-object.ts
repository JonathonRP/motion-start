/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
function isRefObject<E = any>(ref: any): ref is { current: E } {
	return typeof ref === 'object' && Object.prototype.hasOwnProperty.call(ref, 'current');
}

export { isRefObject };
