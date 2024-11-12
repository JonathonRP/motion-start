import type { RefObject } from '../utils/safe-react-types';

export type UseDomEventProps = {
	/**
	 * Ref object that's been provided to the element you want to bind the listener to.
	 */
	ref: RefObject<EventTarget>;
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
};

export { default as UseDomEvent } from './UseDomEvent.svelte';
