/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { SequenceTime } from '../types.svelte';

/**
 * Given a absolute or relative time definition and current/prev time state of the sequence,
 * calculate an absolute time for the next keyframes.
 */
export function calcNextTime(current: number, next: SequenceTime, prev: number, labels: Map<string, number>): number {
	if (typeof next === 'number') {
		return next;
	} else if (next.startsWith('-') || next.startsWith('+')) {
		return Math.max(0, current + Number.parseFloat(next));
	} else if (next === '<') {
		return prev;
	} else {
		return labels.get(next) ?? current;
	}
}
