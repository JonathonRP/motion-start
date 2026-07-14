/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

export const clamp = (min: number, max: number, v: number) => {
	if (v > max) return max;
	if (v < min) return min;
	return v;
};
