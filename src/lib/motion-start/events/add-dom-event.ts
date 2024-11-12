/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

export function addDomEvent(
	target: EventTarget,
	eventName: string,
	handler: EventListener,
	options: AddEventListenerOptions = { passive: true }
) {
	target.addEventListener(eventName, handler, options);

	return () => target.removeEventListener(eventName, handler);
}
