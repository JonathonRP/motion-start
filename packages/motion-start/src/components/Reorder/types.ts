import type { Axis, Box } from '../../projection/geometry/types.js';
import type { ReactiveInvalidation } from '../../utils/reactive-invalidation.js';

export interface ReorderContext<T> {
	axis: 'x' | 'y';
	registerItem: (item: T, layout: Box) => void;
	unregisterItem: (item: T) => void;
	updateOrder: (item: T, offset: number, velocity: number) => void;
	/**
	 * A stable, reactive invalidation token. It only changes when
	 * `updateOrder` produces a genuinely new order, so consumers can use it
	 * as a layout dependency without re-snapshotting on every drag tick.
	 */
	layoutInvalidation: ReactiveInvalidation;
}

export interface ItemData<T> {
	value: T;
	layout: Axis;
}
