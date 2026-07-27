/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { frame, cancelFrame } from '../../../frameloop/index.js';
import { frameData } from '../../../frameloop/index.js';
import { time } from '../../../frameloop/sync-time.js';
import type { FrameData } from '../../../frameloop/types.js';
import type { Driver } from './types.js';

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
