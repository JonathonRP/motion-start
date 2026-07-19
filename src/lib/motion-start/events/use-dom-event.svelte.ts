import type { RefObject } from '../utils/safe-react-types.js';
import { addDomEvent } from './add-dom-event.js';

/**
 * Attaches a native event listener to the current target and removes it when
 * the component that called this utility is destroyed.
 *
 * @public
 */
export function useDomEvent(
	ref: RefObject<EventTarget>,
	eventName: string,
	handler?: EventListener,
	options?: AddEventListenerOptions
) {
	$effect.pre(() => {
		const element = ref.current;

		if (handler && element) {
			return addDomEvent(element, eventName, handler, options);
		}
	});
}
