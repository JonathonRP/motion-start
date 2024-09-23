/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { WithDepth } from "./compare-by-depth";

class FlatTree {
    private children: any[] = [];
    private isDirty = false;
    add(child: WithDepth) {
        addUniqueItem(this.children, child);
        this.isDirty = true;
    };
    remove(child: WithDepth) {
        removeItem(this.children, child);
        this.isDirty = true;
    }
    forEach(callback: (child: WithDepth) => void) {
        this.isDirty && this.children.sort(compareByDepth);
        var numChildren = this.children.length;
        for (var i = 0; i < numChildren; i++) {
            callback(this.children[i]);
        }
    }
}


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { addUniqueItem, removeItem } from '../../utils/array.js';
import { compareByDepth } from './compare-by-depth.js';

export { FlatTree };
