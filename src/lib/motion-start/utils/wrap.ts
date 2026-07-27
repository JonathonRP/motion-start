/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

export const wrap = (min: number, max: number, v: number) => {
	const rangeSize = max - min;
	return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};
