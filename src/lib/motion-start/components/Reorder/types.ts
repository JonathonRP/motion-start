/**
 * Reorder types
 * Based on Motion v11.11.11
 */

import type { Snippet } from 'svelte';
import type { MotionProps } from '../../motion/types.js';

export interface ReorderGroupProps<T = any> extends Omit<MotionProps, 'onDragEnd'> {
	/**
	 * Array of values to reorder
	 */
	values: T[];

	/**
	 * Callback when reorder completes
	 */
	onReorder: (newOrder: T[]) => void;

	/**
	 * Axis to allow dragging on
	 * @default "y"
	 */
	axis?: 'x' | 'y';

	/**
	 * Children to render
	 */
	children?: Snippet<[{ values: T[] }]>;

	/**
	 * Whether the container is scrollable (enables layoutScroll)
	 * @default false
	 */
	layoutScroll?: boolean;
}

export interface ReorderItemProps<T = any> extends MotionProps {
	/**
	 * The value this item represents
	 */
	value: T;

	/**
	 * Children to render
	 */
	children?: Snippet;

	/**
	 * Whether dragging is enabled
	 * @default true
	 */
	dragListener?: boolean;

	/**
	 * Custom drag controls
	 */
	dragControls?: any;
}

export interface ReorderContextValue<T = any> {
	axis: 'x' | 'y';
	values: T[];
	updateOrder: (item: T, offset: number) => void;
}
