/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

export function addDomEvent(
	target: EventTarget,
	eventName: string,
	handler: EventListener | ((evt: KeyboardEvent) => void),
	options: AddEventListenerOptions = { passive: true }
) {
	target.addEventListener(eventName, handler as EventListener, options);

	return () => target.removeEventListener(eventName, handler as EventListener);
}
