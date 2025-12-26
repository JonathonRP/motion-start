/**
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 */

/**
 * No-operation function that returns its input unchanged.
 * Used as an identity function for linear easing when control points
 * form a linear curve (mX1 === mY1 && mX2 === mY2).
 *
 * @param any - The value to return
 * @returns The same value that was passed in
 */
export const noop = <T>(any: T): T => any;
