/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { memo } from '../../../../utils/memo';

export const supportsPartialKeyframes = /*@__PURE__*/ memo(() => {
	try {
		document.createElement('div').animate({ opacity: [1] });
	} catch (e) {
		return false;
	}
	return true;
});
