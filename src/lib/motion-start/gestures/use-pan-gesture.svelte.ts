/**
 * Pan Gesture Hook
 * Detects pan/swipe gestures with velocity tracking
 *
 * Based on framer-motion@11.11.11
 * @module use-pan-gesture
 */

import { addPointerEvent } from '../events/use-pointer-event.js';
import { useMotionConfig } from '../context/motion-config-context.svelte.js';
import { PanSession, type PanHandler } from './PanSession.js';
import type { VisualElement } from '../render/types.js';

/**
 * Pan gesture event handlers
 */
export interface PanGestureHandlers {
	/** Fired when pan session starts (pointer down) */
	onPanSessionStart?: PanHandler;
	/** Fired when pan starts (after threshold) */
	onPanStart?: PanHandler;
	/** Fired during pan movement */
	onPan?: PanHandler;
	/** Fired when pan ends */
	onPanEnd?: PanHandler;
}

/**
 * Use pan gesture detection
 *
 * Detects pan/swipe gestures on an element with support for:
 * - Velocity tracking
 * - Delta and offset calculations
 * - Configurable transform page point
 * - Movement threshold (3px)
 * - Automatic cleanup
 *
 * @example
 * ```svelte
 * <script>
 *   import { usePanGesture } from 'motion-start/gestures';
 *
 *   let visualElement = $state();
 *   let props = $props();
 *
 *   usePanGesture(
 *     () => visualElement,
 *     () => props
 *   );
 * </script>
 * ```
 *
 * @param getVisualElement - Function returning the visual element
 * @param getHandlers - Function returning pan gesture handlers
 * @public
 */
export function usePanGesture(
	getVisualElement: () => VisualElement | undefined,
	getHandlers: () => PanGestureHandlers
): void {
	let panSession = $state<PanSession | null>(null);
	const config = useMotionConfig();

	// Update handlers when they change
	$effect(() => {
		const handlers = getHandlers();
		if (panSession) {
			panSession.updateHandlers({
				onSessionStart: handlers.onPanSessionStart,
				onStart: handlers.onPanStart,
				onMove: handlers.onPan,
				onEnd: (event, info) => {
					panSession = null;
					handlers.onPanEnd?.(event, info);
				},
				onSessionEnd: () => {},
			});
		}
	});

	// Set up pointer down listener
	$effect(() => {
		const visualElement = getVisualElement();
		const handlers = getHandlers();
		const hasPanEvents = !!(
			handlers.onPan ||
			handlers.onPanStart ||
			handlers.onPanEnd ||
			handlers.onPanSessionStart
		);

		if (!visualElement || !hasPanEvents) {
			return;
		}

		const instance = visualElement.getInstance();
		if (!instance) return;

		const onPointerDown = (event: PointerEvent) => {
			panSession = new PanSession(
				event,
				{
					onSessionStart: handlers.onPanSessionStart,
					onStart: handlers.onPanStart,
					onMove: handlers.onPan,
					onEnd: (evt, info) => {
						panSession = null;
						handlers.onPanEnd?.(evt, info);
					},
					onSessionEnd: () => {},
				},
				{
					transformPagePoint: config.transformPagePoint,
				}
			);
		};

		const cleanup = addPointerEvent(instance, 'pointerdown', onPointerDown as any);

		return () => {
			cleanup();
			panSession?.end();
			panSession = null;
		};
	});
}
