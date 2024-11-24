/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/

import { writable, type Writable } from 'svelte/store';
import { getDomContext } from './DOMcontext';

export const DeprecatedLayoutGroupContext = (c?: any): Writable<string | null> =>
	getDomContext('DeprecatedLayoutGroupContext', c) || writable(null);
