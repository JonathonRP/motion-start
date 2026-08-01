/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

export interface AppearStoreEntry {
	animation: Animation;
	startTime: number | null;
}

export type AppearElementId = string;

export type IsComplete = boolean;

const browserGlobal = typeof window === 'undefined' ? undefined : window;

export const appearAnimationStore =
	browserGlobal?.__MotionAppearAnimations ?? new Map<AppearElementId, AppearStoreEntry>();

export const appearComplete = browserGlobal?.__MotionAppearComplete ?? new Map<AppearElementId, IsComplete>();

/**
 * The parser-time bootstrap emitted by the `appear` prop usually runs before
 * this module is evaluated, but a client-only entry can load it first.
 * Publishing the maps back onto `window` keeps the inline script and
 * `startOptimizedAppearAnimation` on the same store whichever order they run in.
 */
if (browserGlobal) {
	browserGlobal.__MotionAppearAnimations = appearAnimationStore;
	browserGlobal.__MotionAppearComplete = appearComplete;
}
