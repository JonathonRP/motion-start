/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { transformProps } from '../../render/html/utils/transform.svelte';

export const appearStoreId = (elementId: string, valueName: string) => {
	const key = transformProps.has(valueName) ? 'transform' : valueName;

	return `${elementId}: ${key}`;
};