/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { SvelteHTMLElements } from 'svelte/elements';
import { createDOMMotionComponentProxy } from '../create-proxy';
import { createMotionComponent } from './create';

export const motion = /*@__PURE__*/ createDOMMotionComponentProxy(createMotionComponent);
