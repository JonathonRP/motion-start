/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { memo } from '../../../../utils/memo';
import { supportsFlags } from './supports-flags';

export function memoSupports<T>(callback: () => T, supportsFlag: keyof typeof supportsFlags) {
	const memoized = memo(callback);
	return () => supportsFlags[supportsFlag] ?? memoized();
}
