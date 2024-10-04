/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { Writable } from 'svelte/store';
import type { SharedLayoutSyncMethods, SyncLayoutBatcher } from '../components/AnimateSharedLayout/types';

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/

import { writable } from 'svelte/store';
import { createBatcher } from '../components/AnimateSharedLayout/utils/batcher.js';
import { getDomContext } from './DOMcontext.js';
function SharedLayoutContext(custom?: any): Writable<SyncLayoutBatcher> | Writable<SharedLayoutSyncMethods> {
	return (getDomContext('SharedLayout', custom) as any satisfies SharedLayoutSyncMethods) || writable(createBatcher());
}

/**
 * @internal
 */
var FramerTreeLayoutContext = () => writable(createBatcher());

function isSharedLayout(context: SyncLayoutBatcher | SharedLayoutSyncMethods): context is SharedLayoutSyncMethods {
	return 'forceUpdate' in context;
}

export { FramerTreeLayoutContext, SharedLayoutContext, isSharedLayout };
