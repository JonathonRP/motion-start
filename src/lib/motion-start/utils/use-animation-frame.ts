/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { frame, cancelFrame } from '../frameloop';
import { MotionConfigContext } from '../context/MotionConfigContext';
import type { FrameData } from '../frameloop/types';
import { getContext, tick } from 'svelte';
import { get, type Writable } from 'svelte/store';

export type FrameCallback = (timestamp: number, delta: number) => void;

export function useAnimationFrame(callback: FrameCallback, isCustom = false) {
	let initialTimestamp = 0;
	const mcc = getContext<Writable<MotionConfigContext>>(MotionConfigContext) || MotionConfigContext(isCustom);
	const { isStatic } = get(mcc);

	if (isStatic) return;

	const provideTimeSinceStart = ({ timestamp, delta }: FrameData) => {
		if (!initialTimestamp) initialTimestamp = timestamp;

		callback(timestamp - initialTimestamp, delta);
	};

	frame.update(provideTimeSinceStart, true);

	tick().then(() => {
		const { isStatic } = get(mcc);

		if (isStatic) return;

		const provideTimeSinceStart = ({ timestamp, delta }: FrameData) => {
			if (!initialTimestamp) initialTimestamp = timestamp;

			callback(timestamp - initialTimestamp, delta);
		};

		frame.update(provideTimeSinceStart, true);
		return () => cancelFrame(provideTimeSinceStart);
	});

	return () => cancelFrame(provideTimeSinceStart);
}
