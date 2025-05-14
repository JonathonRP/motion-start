/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { moveItem } from '../../../utils/array';
import { mixNumber } from '../../../utils/mix/number';
import type { ItemData } from '../types';

export function checkReorder<T>(order: () => ItemData<T>[], value: T, offset: number, velocity: number): ItemData<T>[] {
	const currentOrder = $derived.by(order);
	if (!velocity) return currentOrder;

	const index = currentOrder.findIndex((item) => item.value === value);

	if (index === -1) return currentOrder;

	const nextOffset = velocity > 0 ? 1 : -1;
	const nextItem = currentOrder[index + nextOffset];

	if (!nextItem) return currentOrder;

	const item = currentOrder[index];
	const nextLayout = nextItem.layout;
	const nextItemCenter = mixNumber(nextLayout.min, nextLayout.max, 0.5);

	if (
		(nextOffset === 1 && item.layout.max + offset > nextItemCenter) ||
		(nextOffset === -1 && item.layout.min + offset < nextItemCenter)
	) {
		return moveItem(currentOrder, index, index + nextOffset);
	}

	return currentOrder;
}
