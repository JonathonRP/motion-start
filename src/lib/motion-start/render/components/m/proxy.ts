/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { createDOMMotionComponentProxy } from '../create-proxy';
import { createMinimalMotionComponent } from './create';

export const m = /*@__PURE__*/ createDOMMotionComponentProxy(createMinimalMotionComponent);
