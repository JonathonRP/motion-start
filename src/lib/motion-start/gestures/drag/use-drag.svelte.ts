/**
 * Drag Gesture Hook
 * Enables dragging with constraints and momentum
 *
 * Based on framer-motion@11.11.11
 * @module use-drag
 */

import { useMotionConfig } from '../../context/motion-config-context.svelte.js';
import { VisualElementDragControls } from './VisualElementDragControls.js';
import type { VisualElement } from '../../render/types.js';
import type { DragHandlers, DraggableProps } from './types.js';

/**
 * Drag gesture configuration
 */
export interface DragGestureHandlers extends DragHandlers, DraggableProps {}

/**
 * Use drag gesture
 *
 * Enables dragging on an element with support for:
 * - Drag constraints (position limits)
 * - Drag elasticity (bounce effect)
 * - Momentum/inertia
 * - Manual drag controls
 * - Lock to axis (x or y only)
 * - Propagation control
 * - Automatic cleanup
 *
 * @example
 * ```svelte
 * <script>
 *   import { useDrag } from 'motion-start/gestures/drag';
 *
 *   let visualElement = $state();
 *   let props = $props();
 *
 *   useDrag(
 *     () => visualElement,
 *     () => props
 *   );
 * </script>
 * ```
 *
 * @param getVisualElement - Function returning the visual element
 * @param getProps - Function returning drag configuration and handlers
 * @public
 */
export function useDrag(
	getVisualElement: () => VisualElement | undefined,
	getProps: () => DragGestureHandlers
): void {
	const config = useMotionConfig();
	let dragControls: VisualElementDragControls | null = null;
	let mountCleanup: (() => void) | null = null;
	let externalCleanup: (() => void) | null = null;

	// Initialize drag controls
	$effect(() => {
		const visualElement = getVisualElement();
		if (!visualElement) return;

		// Create drag controls
		if (!dragControls) {
			dragControls = new VisualElementDragControls({ visualElement });
		}

		// Mount drag controls (returns cleanup function)
		mountCleanup = dragControls.mount(visualElement);

		return () => {
			mountCleanup?.();
			mountCleanup = null;
		};
	});

	// Update props when they change
	$effect(() => {
		if (!dragControls) return;

		const props = getProps();
		dragControls.setProps({
			...props,
			transformPagePoint: config.transformPagePoint,
		});
	});

	// Subscribe to external drag controls if provided
	$effect(() => {
		if (!dragControls) return;

		const props = getProps();
		const groupDragControls = props.dragControls;

		// Clean up previous subscription
		externalCleanup?.();
		externalCleanup = null;

		// Subscribe to new drag controls
		if (groupDragControls) {
			externalCleanup = groupDragControls.subscribe(dragControls);
		}

		return () => {
			externalCleanup?.();
			externalCleanup = null;
		};
	});
}
