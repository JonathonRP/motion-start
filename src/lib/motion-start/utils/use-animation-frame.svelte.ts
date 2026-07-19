/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { frame, cancelFrame } from '../frameloop/index.js';
import { useMotionConfigContext } from '../context/MotionConfigContext.svelte.js';
import type { FrameData } from '../frameloop/types.js';

export type FrameCallback = (timestamp: number, delta: number) => void;

export function useAnimationFrame(callback: FrameCallback) {
	let initialTimestamp = 0;
	const { isStatic } = useMotionConfigContext();

	if (isStatic) return;

	const provideTimeSinceStart = ({ timestamp, delta }: FrameData) => {
		if (!initialTimestamp) initialTimestamp = timestamp;

		callback(timestamp - initialTimestamp, delta);
	};

	$effect.pre(() => {
		frame.update(provideTimeSinceStart, true);
		return () => cancelFrame(provideTimeSinceStart);
	});
}
