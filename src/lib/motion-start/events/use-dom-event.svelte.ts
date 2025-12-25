/**
 * DOM Event Hook
 * Attaches event listeners directly to DOM elements
 *
 * Based on framer-motion@11.11.11
 * @module use-dom-event
 */

import type { VisualElement } from '../index.js';

/**
 * Add a DOM event listener to a target element
 *
 * @param target - The DOM element to attach the listener to
 * @param eventName - Name of the event to listen for
 * @param handler - Event handler function
 * @param options - Event listener options
 * @returns Cleanup function to remove the listener
 *
 * @internal
 */
export function addDomEvent(
    target: EventTarget,
    eventName: string,
    handler: EventListener,
    options?: AddEventListenerOptions
): () => void {
    target.addEventListener(eventName, handler, options);
    return () => target.removeEventListener(eventName, handler, options);
}

/**
 * Use a DOM event listener with automatic cleanup
 *
 * Bypassing Svelte's event system can be desirable when you need:
 * - Non-passive event handlers
 * - Direct event listener control
 * - Early event handling before Svelte's delegation
 *
 * @example
 * ```svelte
 * <script>
 *   import { useDomEvent } from 'motion-start/events';
 *
 *   let divRef = $state<HTMLDivElement>();
 *
 *   useDomEvent(
 *     () => divRef,
 *     'wheel',
 *     (e) => console.log('wheel', e),
 *     { passive: false }
 *   );
 * </script>
 *
 * <div bind:this={divRef}>Scroll me</div>
 * ```
 *
 * @param ref - Getter function that returns the element or ref object
 * @param eventName - Name of the event to listen for
 * @param handler - Event handler function
 * @param options - Event listener options
 * @public
 */
export function useDomEvent(
    ref: () => HTMLElement | null | undefined | { current: Node } | VisualElement<EventTarget>,
    eventName: string,
    handler: EventListener | undefined,
    options?: AddEventListenerOptions
): void {
    $effect(() => {
        const target = ref();
        if (!target || !handler) return;

        // Handle ref objects with .current property
        const element = 'current' in target ? target.current : target;

        if (element instanceof EventTarget) {
            return addDomEvent(element, eventName, handler, options);
        }
    });
}
