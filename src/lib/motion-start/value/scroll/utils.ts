/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/

import { motionValue, type MotionValue } from '../';
/**
 * @public
 */
export interface ScrollMotionValues {
	scrollX: MotionValue<number>;
	scrollY: MotionValue<number>;
	scrollXProgress: MotionValue<number>;
	scrollYProgress: MotionValue<number>;
}
export interface ScrollOffsets {
	xOffset: number;
	yOffset: number;
	xMaxOffset: number;
	yMaxOffset: number;
}
export type GetScrollOffsets = () => ScrollOffsets;

export function createScrollMotionValues(startStopNotifier?: () => Promise<() => void>): ScrollMotionValues {
	const hasListener = { x: false, y: false, xp: false, yp: false };
	let stop: Promise<() => void>;

	const jointNotifier = startStopNotifier
		? (type: string | number) => () => {
				if (!hasListener.x && !hasListener.y && !hasListener.xp && !hasListener.yp) {
					stop = startStopNotifier();
				}
				(hasListener as any)[type] = true;
				return () => {
					(hasListener as any)[type] = false;
					if (!hasListener.x && !hasListener.y && !hasListener.xp && !hasListener.yp) {
						if (stop) {
							stop.then((v) => v());
						}
					}
				};
			}
		: () => void {};

	return {
		scrollX: motionValue(0, jointNotifier('x')),
		scrollY: motionValue(0, jointNotifier('y')),
		scrollXProgress: motionValue(0, jointNotifier('xp')),
		scrollYProgress: motionValue(0, jointNotifier('yp')),
	};
}

function setProgress(offset: number, maxOffset: number, value: MotionValue<number>) {
	value.set(!offset || !maxOffset ? 0 : offset / maxOffset);
}

export function createScrollUpdater(values: ScrollMotionValues, getOffsets: GetScrollOffsets) {
	const update = () => {
		const { xOffset, yOffset, xMaxOffset, yMaxOffset } = getOffsets();
		// Set absolute positions
		values.scrollX.set(xOffset);
		values.scrollY.set(yOffset);
		// Set 0-1 progress
		setProgress(xOffset, xMaxOffset, values.scrollXProgress);
		setProgress(yOffset, yMaxOffset, values.scrollYProgress);
	};
	update();
	return update;
}
