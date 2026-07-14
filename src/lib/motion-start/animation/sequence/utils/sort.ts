/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { AbsoluteKeyframe } from '../types';

export function compareByTime(a: AbsoluteKeyframe, b: AbsoluteKeyframe): number {
	if (a.at === b.at) {
		if (a.value === null) return 1;
		if (b.value === null) return -1;
		return 0;
	} else {
		return a.at - b.at;
	}
}
