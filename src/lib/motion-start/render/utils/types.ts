/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
export const AnimationType = {
	animate: 'animate',
	whileHover: 'whileHover',
	whileTap: 'whileTap',
	whileDrag: 'whileDrag',
	whileFocus: 'whileFocus',
	whileInView: 'whileInView',
	exit: 'exit',
} as const;

export type AnimationType = (typeof AnimationType)[keyof typeof AnimationType];
