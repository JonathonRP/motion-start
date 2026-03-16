import type { Axis, Box } from '../../projection/geometry/types';

export interface ReorderContext<T> {
	axis: 'x' | 'y';
	/** Increments after each reorder — used as layoutDependency to trigger re-measurement. */
	orderVersion: number;
	registerItem: (item: T, layout: Box) => void;
	updateOrder: (item: T, offset: number, velocity: number) => void;
}

export interface ItemData<T> {
	value: T;
	layout: Axis;
}
