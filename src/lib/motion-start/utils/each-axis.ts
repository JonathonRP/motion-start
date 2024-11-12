/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

// Call a handler once for each axis
export function eachAxis<T>(handler: (axis: 'x' | 'y') => T): T[] {
	return [handler('x'), handler('y')];
}
