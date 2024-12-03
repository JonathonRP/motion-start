/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { lowercaseSVGElements } from '../../svg/lowercase-elements.js';

export function isSVGComponent(Component: string) {
	if (
		/**
		 * If it's not a string, it's a custom React component. Currently we only support
		 * HTML custom React components.
		 */
		typeof Component !== 'string' ||
		/**
		 * If it contains a dash, the element is a custom HTML webcomponent.
		 */
		Component.includes('-')
	) {
		return false;
	} else if (
		/**
		 * If it's in our list of lowercase SVG tags, it's an SVG component
		 */
		lowercaseSVGElements.indexOf(Component) > -1 ||
		/**
		 * If it contains a capital letter, it's an SVG component
		 */
		/[A-Z]/u.test(Component)
	) {
		return true;
	}

	return false;
}
