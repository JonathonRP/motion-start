/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { IProjectionNode } from './types.js';
import { DocumentProjectionNode } from './DocumentProjectionNode.js';

/**
 * HTMLProjectionNode - Projection node implementation for HTML elements
 *
 * This is the primary projection node used for layout animations on HTML elements.
 * It extends DocumentProjectionNode with HTML-specific measurement and transform logic.
 *
 * Note: This is a placeholder implementation. The full projection node system
 * will be implemented as part of the layout animation feature development.
 * The structure follows framer-motion v11.11.11 architecture.
 */

export const HTMLProjectionNode = DocumentProjectionNode;

/**
 * Root projection node for the document
 * All projection nodes in the tree reference this as their ultimate parent
 */
export const rootProjectionNode: {
	current: IProjectionNode | undefined;
} = {
	current: undefined,
};
