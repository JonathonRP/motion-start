/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { EventListenerWithPointInfo } from './event-info';
export type usePointerEvent = (
	ref: { current: Element | null },
	eventName: string,
	handler?: EventListenerWithPointInfo | undefined,
	options?: AddEventListenerOptions
) => void;

export interface UsePointerEventProps {
	/**
	 * Ref object that's been provided to the element you want to bind the listener to.
	 */
	ref: { current: Element | null };
	/**
	 * Name of the event you want listen for.
	 */
	eventName: string;
	/**
	 * Function to fire when receiving the event.
	 */
	handler?: EventListener | undefined;
	/**
	 * Options to pass to `Event.addEventListener`.
	 */
	options?: AddEventListenerOptions;
}

// @ts-ignore
export { default as UsePointerEvent, addPointerEvent } from './UsePointerEvent.svelte';
