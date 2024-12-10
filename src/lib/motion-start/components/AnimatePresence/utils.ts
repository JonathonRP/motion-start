/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { writable } from 'svelte/store';

export const Children$ = writable<{ key: string }[]>();

export type ComponentKey = number | undefined;

export const getChildKey = (child: { key: number | undefined }): ComponentKey => child.key || undefined;

// export function onlyElements(children: (Element & { key: number })[]): (Element & { key: number })[] {
// 	return children.filter();
// }
