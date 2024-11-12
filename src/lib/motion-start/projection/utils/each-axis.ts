/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

type Callback = (axis: 'x' | 'y') => void;

export function eachAxis(callback: Callback) {
	return [callback('x'), callback('y')];
}
