import type { RefObject } from '../utils/safe-react-types.js';
import { addDomEvent } from './add-dom-event.js';

interface DomEventConfig {
	ref: RefObject<EventTarget>;
	eventName: string;
	handler?: EventListener;
	options?: AddEventListenerOptions;
}

export function useDomEvent(getConfig: () => DomEventConfig): void;
export function useDomEvent(
	ref: RefObject<EventTarget>,
	eventName: string,
	handler?: EventListener,
	options?: AddEventListenerOptions
): void;
/**
 * Attaches a native event listener to the current target and removes it when
 * the component that called this utility is destroyed.
 *
 * @public
 */
export function useDomEvent(
	refOrConfig: RefObject<EventTarget> | (() => DomEventConfig),
	eventName?: string,
	handler?: EventListener,
	options?: AddEventListenerOptions
) {
	$effect.pre(() => {
		const config =
			typeof refOrConfig === 'function'
				? refOrConfig()
				: { ref: refOrConfig, eventName: eventName!, handler, options };
		const { ref, eventName: currentEventName, handler: currentHandler, options: currentOptions } = config;
		const element = ref.current;

		if (currentHandler && element) {
			return addDomEvent(element, currentEventName, currentHandler, currentOptions);
		}
	});
}
