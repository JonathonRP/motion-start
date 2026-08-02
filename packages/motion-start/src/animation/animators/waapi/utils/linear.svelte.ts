/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { EasingFunction } from '../../../../easing/types.js';
import { progress } from '../../../../utils/progress.js';

// Create a linear easing point for every 10 ms
const resolution = 10;

export const generateLinearEasing = (
	easing: EasingFunction,
	duration: number // as milliseconds
): string => {
	let points = '';
	const numPoints = Math.max(Math.round(duration / resolution), 2);

	for (let i = 0; i < numPoints; i++) {
		points += Math.round(easing(progress(0, numPoints - 1, i)) * 10000) / 10000 + ', ';
	}

	return `linear(${points.substring(0, points.length - 2)})`;
};
