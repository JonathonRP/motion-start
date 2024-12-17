/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { memoSupports } from './memo-supports.svelte';

export const supportsLinearEasing = /*@__PURE__*/ memoSupports(() => {
	try {
		document.createElement('div').animate({ opacity: 0 }, { easing: 'linear(0, 1)' });
	} catch (e) {
		return false;
	}
	return true;
}, 'linearEasing');
