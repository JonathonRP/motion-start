/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { memo } from '../../../../utils/memo.js';

export const supportsWaapi = /*@__PURE__*/ memo(
	() => typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function'
);
