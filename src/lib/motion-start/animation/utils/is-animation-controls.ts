/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import type { AnimationControls } from '../types';

export function isAnimationControls(v?: unknown): v is AnimationControls {
	return v !== null && typeof v === 'object' && typeof (v as AnimationControls).start === 'function';
}
