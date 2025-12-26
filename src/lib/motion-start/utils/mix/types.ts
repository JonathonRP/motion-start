/**
 * Type definitions for mix utilities
 */

/**
 * A function that mixes between two values based on a progress value (0-1)
 */
export type Mixer<T> = (p: number) => T;
