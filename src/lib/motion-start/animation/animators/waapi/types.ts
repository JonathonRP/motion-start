/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { Easing } from '../../../easing/types';

export interface NativeAnimationOptions {
	delay?: number;
	duration?: number;
	ease?: Easing | Easing[];
	times?: number[];
	repeat?: number;
	repeatType?: 'loop' | 'reverse' | 'mirror';
}
