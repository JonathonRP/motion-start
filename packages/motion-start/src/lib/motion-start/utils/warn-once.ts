/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

const warned = new Set<string>();

export function hasWarned(message: string) {
	return warned.has(message);
}

export function warnOnce(condition: boolean, message: string, element?: Element) {
	if (condition || warned.has(message)) return;

	console.warn(message);
	if (element) console.warn(element);
	warned.add(message);
}
