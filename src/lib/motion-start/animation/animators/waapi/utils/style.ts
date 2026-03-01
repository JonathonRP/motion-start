/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

type MotionStyleKey = Exclude<keyof CSSStyleDeclaration, 'length' | 'parentRule'>;

export function setCSSVar(element: HTMLElement, name: string, value: string | number) {
	element.style.setProperty(`--${name}`, value as string);
}

export function setStyle(element: HTMLElement, name: string, value: string | number) {
	// Use setProperty for safety since name is dynamic and may not be a known CSS property
	element.style.setProperty(name, String(value));
}
