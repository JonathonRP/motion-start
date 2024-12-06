/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { warnOnce } from '../../utils/warn-once';
import { useScroll } from '../use-scroll.svelte';

/**
 * @deprecated useViewportScroll is deprecated. Convert to useScroll()
 */
export function useViewportScroll() {
	if (process.env.NODE_ENV !== 'production') {
		warnOnce(false, 'useViewportScroll is deprecated. Convert to useScroll().');
	}
	return useScroll();
}
