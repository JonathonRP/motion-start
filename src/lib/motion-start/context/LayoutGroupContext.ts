/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { Writable } from 'svelte/store';

import { writable } from 'svelte/store';
import { getDomContext } from './DOMcontext';
import type { NodeGroup } from '../projection/node/group';
import { getContext, setContext } from 'svelte';

export interface LayoutGroupContextProps {
	id?: string;
	group?: NodeGroup;
	forceRender?: VoidFunction;
}

export const LayoutGroupContext = (c?: any): Writable<LayoutGroupContextProps> =>
	getDomContext('LayoutGroup', c) || writable({});

const layoutGroupContextKey = Symbol('LayoutGroup');

export function createLayoutGroupContext(value: Writable<LayoutGroupContextProps>) {
	setContext(layoutGroupContextKey, value);
}
export function useLayoutGroupContext(el?: any): Writable<LayoutGroupContextProps> {
	return (
		getContext<ReturnType<typeof useLayoutGroupContext>>(layoutGroupContextKey) ||
		getDomContext('LayoutGroup', el) ||
		writable({})
	);
}
