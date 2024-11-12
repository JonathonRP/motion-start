/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { VisualElement } from '../VisualElement';
import { addUniqueItem, removeItem } from '../../utils/array';
import { compareByDepth, type WithDepth } from './compare-by-depth';

export class FlatTree {
	private children: (VisualElement & WithDepth)[] = [];

	private isDirty = false;

	add(child: WithDepth) {
		addUniqueItem(this.children, child);
		this.isDirty = true;
	}

	remove(child: WithDepth) {
		removeItem(this.children, child);
		this.isDirty = true;
	}

	forEach(callback: (child: WithDepth) => void) {
		this.isDirty && this.children.sort(compareByDepth);
		this.isDirty = false;
		this.children.forEach(callback);
	}
}
