import type { Axis, Box } from '../../projection/geometry/types';

export interface ReorderContext<T> {
	axis: 'x' | 'y';
	registerItem: (item: T, layout: Box) => void;
	updateOrder: (item: T, offset: number, velocity: number) => void;
	/** Called when drag ends - allows cleanup of drag state */
	onDragEnd?: (value: T) => void;
}

export interface ItemData<T> {
	value: T;
	layout: Axis;
}
