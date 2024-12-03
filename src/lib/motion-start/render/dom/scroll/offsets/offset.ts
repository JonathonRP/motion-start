/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { Edge, EdgeString, Intersection, ProgressIntersection } from '../types';
import { namedEdges, resolveEdge } from './edge';

const defaultOffset: ProgressIntersection = [0, 0];

export function resolveOffset(
	offset: Edge | Intersection | ProgressIntersection,
	containerLength: number,
	targetLength: number,
	targetInset: number
) {
	let offsetDefinition: ProgressIntersection | [EdgeString, EdgeString] = Array.isArray(offset)
		? offset
		: defaultOffset;

	let targetPoint = 0;
	let containerPoint = 0;

	if (typeof offset === 'number') {
		/**
		 * If we're provided offset: [0, 0.5, 1] then each number x should become
		 * [x, x], so we default to the behaviour of mapping 0 => 0 of both target
		 * and container etc.
		 */
		offsetDefinition = [offset, offset];
	} else if (typeof offset === 'string') {
		offset = offset.trim() as EdgeString;

		if (offset.includes(' ')) {
			offsetDefinition = offset.split(' ') as [EdgeString, EdgeString];
		} else {
			/**
			 * If we're provided a definition like "100px" then we want to apply
			 * that only to the top of the target point, leaving the container at 0.
			 * Whereas a named offset like "end" should be applied to both.
			 */
			offsetDefinition = [offset, namedEdges[offset as keyof typeof namedEdges] ? offset : '0'];
		}
	}

	targetPoint = resolveEdge(offsetDefinition[0], targetLength, targetInset);
	containerPoint = resolveEdge(offsetDefinition[1], containerLength);

	return targetPoint - containerPoint;
}
