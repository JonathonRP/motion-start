/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

/**
 * Recursively traverse up the tree to check whether the provided child node
 * is the parent or a descendant of it.
 *
 * @param parent - Element to find
 * @param child - Element to test against parent
 */
export const isNodeOrChild = (parent: Element | null, child?: Element | null): boolean => {
	if (!child) {
		return false;
	} else if (parent === child) {
		return true;
	} else {
		return isNodeOrChild(parent, child.parentElement);
	}
};
