/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { frame, cancelFrame } from '../frameloop';
import { useContext } from '../context/use';
import { MotionConfigContext } from '../context/MotionConfigContext';
import type { FrameData } from '../frameloop/types';

export type FrameCallback = (timestamp: number, delta: number) => void;

export function useAnimationFrame(callback: FrameCallback) {
	let initialTimestamp = 0;
	const { isStatic } = useContext(MotionConfigContext);

	$effect.pre(() => {
		if (isStatic) return;

		const provideTimeSinceStart = ({ timestamp, delta }: FrameData) => {
			if (!initialTimestamp) initialTimestamp = timestamp;

			callback(timestamp - initialTimestamp, delta);
		};

		frame.update(provideTimeSinceStart, true);

		return () => cancelFrame(provideTimeSinceStart);
	});
}
