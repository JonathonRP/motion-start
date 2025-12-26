/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
function isRefObject<E = any>(ref: any): ref is { current: E } {
	return typeof ref === 'object' && Object.prototype.hasOwnProperty.call(ref, 'current');
}

export { isRefObject };
