/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { createDOMMotionComponentProxy } from '../create-proxy.js';
import { createMotionComponent } from './create.js';

export const motion = /*@__PURE__*/ createDOMMotionComponentProxy(createMotionComponent);
