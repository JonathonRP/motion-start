/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { Box, Point } from '../geometry/types.js';
import type { ResolvedValues } from '../../render/types.js';
import type { IProjectionNode, ProjectionNodeConfig } from './types.js';

/**
 * DocumentProjectionNode - Base projection node for document-level operations
 *
 * This serves as the foundation for the projection node system, handling:
 * - Layout measurement and bounding box calculation
 * - Scroll offset tracking
 * - Transform reset/restore operations
 * - Tree structure management (parent/child relationships)
 *
 * Note: This is a placeholder implementation. The full projection node system
 * will be implemented as part of the layout animation feature development.
 * The structure follows framer-motion v11.11.11 architecture.
 */

/**
 * Placeholder factory for creating a projection node
 *
 * In the full implementation, this will:
 * 1. Manage the projection tree hierarchy
 * 2. Calculate layout deltas for animations
 * 3. Handle shared layout transitions
 * 4. Coordinate with the visual element system
 * 5. Optimize rendering through selective updates
 */
export function DocumentProjectionNode<I = unknown>(config: ProjectionNodeConfig<I>): IProjectionNode<I> {
	// This is a stub implementation that will be fleshed out when implementing layout animations
	// For now, we're establishing the file structure to match framer-motion v11.11.11

	throw new Error(
		'DocumentProjectionNode is not yet implemented. ' +
		'This is part of the layout animation system that will be developed in a future update. ' +
		'The projection infrastructure has been reorganized to match framer-motion v11.11.11 structure.'
	);
}

/**
 * Measure scroll offset for an instance
 */
export function measureScroll(instance: HTMLElement): Point {
	return {
		x: instance.scrollLeft,
		y: instance.scrollTop,
	};
}

/**
 * Measure page box for an instance
 */
export function measurePageBox(instance: HTMLElement, transformPagePoint?: (point: Point) => Point): Box {
	const rect = instance.getBoundingClientRect();

	const topLeft = transformPagePoint ? transformPagePoint({ x: rect.left, y: rect.top }) : { x: rect.left, y: rect.top };
	const bottomRight = transformPagePoint ? transformPagePoint({ x: rect.right, y: rect.bottom }) : { x: rect.right, y: rect.bottom };

	return {
		x: { min: topLeft.x, max: bottomRight.x },
		y: { min: topLeft.y, max: bottomRight.y },
	};
}

/**
 * Reset transform on an instance
 */
export function resetTransform(instance: HTMLElement, value?: ResolvedValues): void {
	if (value) {
		instance.style.transform = value.transform as string || '';
	} else {
		instance.style.transform = '';
	}
}
