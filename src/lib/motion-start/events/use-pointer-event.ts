/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { EventListenerWithPointInfo } from './event-info';
import { addDomEvent } from "./use-dom-event.js";
import { wrapHandler } from "./event-info.js";
import {
    supportsMouseEvents,
    supportsPointerEvents,
    supportsTouchEvents,
  } from "./utils.js";

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

const mouseEventNames = {
    pointerdown: "mousedown",
    pointermove: "mousemove",
    pointerup: "mouseup",
    pointercancel: "mousecancel",
    pointerover: "mouseover",
    pointerout: "mouseout",
    pointerenter: "mouseenter",
    pointerleave: "mouseleave",
  };

  const touchEventNames = {
    pointerdown: "touchstart",
    pointermove: "touchmove",
    pointerup: "touchend",
    pointercancel: "touchcancel",
  };
  export function getPointerEventName(name: string) {
    if (supportsPointerEvents()) {
      return name;
    } else if (supportsTouchEvents()) {
      return (touchEventNames as any)[name];
    } else if (supportsMouseEvents()) {
      return (mouseEventNames as any)[name];
    }

    return name;
  }

export function addPointerEvent(
    target: EventTarget,
    eventName: string,
    handler: EventListenerWithPointInfo,
    options?: AddEventListenerOptions
  ) {
    return addDomEvent(
      target,
      getPointerEventName(eventName),
      wrapHandler(handler, eventName === "pointerdown"),
      options
    );
  }

export { default as UsePointerEvent } from './UsePointerEvent.svelte';
