/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

type MotionStyleKey = Exclude<keyof CSSStyleDeclaration, 'length' | 'parentRule'>;

export function setCSSVar(element: HTMLElement, name: string, value: string | number) {
	element.style.setProperty(`--${name}`, value as string);
}

export function setStyle(element: HTMLElement, name: string, value: string | number) {
	// `setProperty` doesn't convert camelCase to kebab-case, so multi-word properties
	// like `clipPath` would be silently dropped. Custom properties can only be set
	// through `setProperty`.
	if (name.startsWith('--')) {
		element.style.setProperty(name, String(value));
	} else {
		element.style[name as MotionStyleKey] = value as never;
	}
}
