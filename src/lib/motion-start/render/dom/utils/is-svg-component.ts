/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { lowercaseSVGElements } from '../../svg/lowercase-elements.js';
import type { Component } from 'svelte';

function isSVGComponent(Component: string | Component) {
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
	}
	if (
		/**
		 * If it's in our list of lowercase SVG tags, it's an SVG component
		 */
		lowercaseSVGElements.indexOf(Component) > -1 ||
		/**
		 * If it contains a capital letter, it's an SVG component
		 */
		/[A-Z]/.test(Component)
	) {
		return true;
	}
	return false;
}

export { isSVGComponent };
