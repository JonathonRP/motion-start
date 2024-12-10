/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { Snippet } from 'svelte';
import { writable } from 'svelte/store';
import type { ConditionalGeneric } from '.';

export const Children$ = writable<{ key: string }[]>();

export type ComponentKey = number | undefined;

export const getChildKey = (child: {
    key: ComponentKey;
}): ComponentKey =>
     child.key || undefined;

function isSvelteComponent(thing: { prototype: { $destroy: any; }; render: any; }) {
    return (thing && typeof window !== 'undefined')
      ? typeof thing.prototype.$destroy === 'function' // client-side
      : typeof thing.render === 'function'; // server-side
  }
export function onlyElements(children: Snippet<[ConditionalGeneric<any> | {
    key: number;
}]>[] | undefined): Snippet<any>[] {
	const filtered: Snippet<any>[] = []
    children?.forEach((child:any) => {
        if (isSvelteComponent(child)) filtered.push(child)
    })

    return filtered
}

// export function onlyElements(children: (Element & { key: number })[]): (Element & { key: number })[] {
// 	return children.filter();
// }
