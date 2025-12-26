/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

/**
 * This is just an arbitrary value to provide a base for measuring scale.
 */
export const globalProjectionState = {
	/**
	 * Global flag as to whether the tree has animated since the last time
	 * we resized the window
	 */
	hasAnimatedSinceResize: true,

	/**
	 * We set this to true once, on the first update. Any nodes added to the tree beyond that
	 * update will be given a `data-projection-id` attribute.
	 */
	hasEverUpdated: false,
};
