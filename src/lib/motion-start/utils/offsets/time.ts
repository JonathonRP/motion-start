/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

export function convertOffsetToTimes(offset: number[], duration: number) {
	return offset.map((o) => o * duration);
}
