/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { tick } from 'svelte';
import { fromStore, get } from 'svelte/store';
import { frame, cancelFrame } from '../frameloop';
import { useContext } from '../context/utils/context.svelte';
import { MotionConfigContext } from '../context/MotionConfigContext';
import type { FrameData } from '../frameloop/types';

export type FrameCallback = (timestamp: number, delta: number) => void;

export function useAnimationFrame(callback: FrameCallback, isCustom = false) {
	let initialTimestamp = 0;
	const { isStatic } = fromStore(useContext(MotionConfigContext, isCustom)).current;

	if (isStatic) return;

	const provideTimeSinceStart = ({ timestamp, delta }: FrameData) => {
		if (!initialTimestamp) initialTimestamp = timestamp;

		callback(timestamp - initialTimestamp, delta);
	};

	frame.update(provideTimeSinceStart, true);

	tick().then(() => {
		const { isStatic } = fromStore(useContext(MotionConfigContext, isCustom)).current;

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
