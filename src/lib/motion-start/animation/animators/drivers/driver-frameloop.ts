/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { frame, cancelFrame } from '../../../frameloop';
import { frameData } from '../../../frameloop';
import { time } from '../../../frameloop/sync-time';
import type { FrameData } from '../../../frameloop/types';
import type { Driver } from './types';

export const frameloopDriver: Driver = (update) => {
	const passTimestamp = ({ timestamp }: FrameData) => update(timestamp);

	return {
		start: () => frame.update(passTimestamp, true),
		stop: () => cancelFrame(passTimestamp),
		/**
		 * If we're processing this frame we can use the
		 * framelocked timestamp to keep things in sync.
		 */
		now: () => (frameData.isProcessing ? frameData.timestamp : time.now()),
	};
};
