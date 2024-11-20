/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionProps } from '../types';
import type { FeatureDefinitions, Expand } from './types';

const featureProps = {
	animation: ['animate', 'variants', 'whileHover', 'whileTap', 'exit', 'whileInView', 'whileFocus', 'whileDrag'],
	exit: ['exit'],
	drag: ['drag', 'dragControls'],
	focus: ['whileFocus'],
	hover: ['whileHover', 'onHoverStart', 'onHoverEnd'],
	tap: ['whileTap', 'onTap', 'onTapStart', 'onTapCancel'],
	pan: ['onPan', 'onPanStart', 'onPanSessionStart', 'onPanEnd'],
	inView: ['whileInView', 'onViewportEnter', 'onViewportLeave'],
	layout: ['layout', 'layoutId'],
};

type KeysOf<T> = T extends T ? keyof T : never;

type RequiredProp<T, U extends 'isEnabled' | KeysOf<T>> = {
	[K in keyof T]?: T[K] | undefined;
} & {
	[K in keyof T as Extract<K, U>]: T[K];
};

export const featureDefinitions: {
	[K in keyof FeatureDefinitions]: Expand<RequiredProp<FeatureDefinitions[K], 'isEnabled'>>;
} = {};

for (const key in featureProps) {
	featureDefinitions[key as keyof typeof featureDefinitions] = {
		isEnabled: (props: MotionProps) =>
			featureProps[key as keyof typeof featureProps].some((name: string) => !!props[name as keyof typeof props]),
	};
}
