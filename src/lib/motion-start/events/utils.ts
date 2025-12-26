/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { isBrowser } from '../utils/is-browser.js';

// We check for event support via functions in case they've been mocked by a testing suite.
var supportsPointerEvents = () => isBrowser && window.onpointerdown === null;
var supportsTouchEvents = () => isBrowser && window.ontouchstart === null;
var supportsMouseEvents = () => isBrowser && window.onmousedown === null;

export { supportsMouseEvents, supportsPointerEvents, supportsTouchEvents };
