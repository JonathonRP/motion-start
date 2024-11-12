/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

export type Mixer<T> = (p: number) => T;

export type MixerFactory<T> = (a: T, b: T) => Mixer<T>;
