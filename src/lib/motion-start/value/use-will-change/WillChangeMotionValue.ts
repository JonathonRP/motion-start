/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { MotionValue } from '../index.svelte';
import type { WillChange } from './types';
import { getWillChangeName } from './get-will-change-name';
import { addUniqueItem } from '../../utils/array';

export class WillChangeMotionValue extends MotionValue implements WillChange {
	private values: string[] = [];

	add(name: string) {
		const styleName = getWillChangeName(name);

		if (styleName) {
			addUniqueItem(this.values, styleName);
			this.inform();
		}
	}

	private inform() {
		this.set(this.values.length ? this.values.join(', ') : 'auto');
	}
}
