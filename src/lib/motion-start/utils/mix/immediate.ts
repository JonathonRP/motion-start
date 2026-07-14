/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

export function mixImmediate<T>(a: T, b: T) {
	return (p: number) => (p > 0 ? b : a);
}
