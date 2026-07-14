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

export const appearAnimationStore = new Map<AppearElementId, AppearStoreEntry>();

export const appearComplete = new Map<AppearElementId, IsComplete>();
