/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

export interface AnimationState<V> {
	value: V;
	done: boolean;
}

export interface KeyframeGenerator<V> {
	calculatedDuration: null | number;
	next: (t: number) => AnimationState<V>;
}
