/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { addDomEvent } from './add-dom-event.svelte';
import { addPointerInfo, type EventListenerWithPointInfo } from './event-info.svelte';

export function addPointerEvent(
	target: EventTarget,
	eventName: string,
	handler: EventListenerWithPointInfo,
	options?: AddEventListenerOptions
) {
	return addDomEvent(target, eventName, addPointerInfo(handler), options);
}
