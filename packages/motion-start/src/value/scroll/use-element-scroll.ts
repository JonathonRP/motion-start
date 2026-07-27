/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { RefObject } from '../../utils/safe-react-types.js';
import { warnOnce } from '../../utils/warn-once.js';
import { useScroll } from '../use-scroll.svelte.js';

/**
 * @deprecated useElementScroll is deprecated. Convert to useScroll({ container: ref })
 */
export function useElementScroll(ref: RefObject<HTMLElement>) {
	if (process.env.NODE_ENV === 'development') {
		warnOnce(false, 'useElementScroll is deprecated. Convert to useScroll({ container: ref }).');
	}

	return useScroll({ container: ref });
}
