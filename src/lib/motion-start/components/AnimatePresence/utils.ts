/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { writable } from 'svelte/store';

export const Children$ = writable<{ key: string }[]>();

export type ComponentKey = string | number;

export const getChildKey = (child: { key: string }): ComponentKey => child.key || '';

// export function onlyElements(children: (Element & { key: number })[]): (Element & { key: number })[] {
// 	return children.filter();
// }
