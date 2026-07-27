import type { Axis, Box } from '../../projection/geometry/types.js';

export interface ReorderContext<T> {
	axis: 'x' | 'y';
	registerItem: (item: T, layout: Box) => void;
	updateOrder: (item: T, offset: number, velocity: number) => void;
	orderVersion?: number;
}

export interface ItemData<T> {
	value: T;
	layout: Axis;
}
