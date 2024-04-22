/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { VisualElementDragControls, type DragControlOptions } from "./VisualElementDragControls";
/**
 * Can manually trigger a drag gesture on one or more `drag`-enabled `motion` components.
 *
 * @motion
 *
 * ```jsx
 * const dragControls = useDragControls()
 *
 * function startDrag(event) {
 *   dragControls.start(event, { snapToCursor: true })
 * }
 *
 * <div onPointerDown={startDrag} />
 * <MotionDiv drag="x" dragControls={dragControls} />
 * ```
 *
 * @public
 */
export class DragControls {
    private componentControls = new Set<VisualElementDragControls>();
    /**
     * Subscribe a component's internal `VisualElementDragControls` to the user-facing API.
     *
     * @internal
     */
    subscribe(controls: VisualElementDragControls): () => void {
        this.componentControls.add(controls);

        return () => this.componentControls.delete(controls);
    }
    /**
     * Start a drag gesture on every `motion` component that has this set of drag controls
     * passed into it via the `dragControls` prop.
     *
     * ```jsx
     * dragControls.start(e, {
     *   snapToCursor: true
     * })
     * ```
     *
     * @param event - PointerEvent
     * @param options - Options
     *
     * @public
     */
    start(event: React.PointerEvent | PointerEvent, options?: DragControlOptions): void {
        this.componentControls.forEach((controls) => {
            controls.start((event as React.PointerEvent).nativeEvent || event),
            options
        })
    }

    updateConstraints(flush?: boolean): void {
        this.componentControls.forEach(function (controls) {
            controls.prepareBoundingBox();
            controls.resolveDragConstraints();
        });
    }
}

const createDragControls = () => new DragControls();

/**
 * Usually, dragging is initiated by pressing down on a `motion` component with a `drag` prop
 * and moving it. For some use-cases, for instance clicking at an arbitrary point on a video scrubber, we
 * might want to initiate that dragging from a different component than the draggable one.
 *
 * By creating a `dragControls` using the `useDragControls` hook, we can pass this into
 * the draggable component's `dragControls` prop. It exposes a `start` method
 * that can start dragging from pointer events on other components.
 *
 * @motion
 *
 * ```jsx
 * const dragControls = useDragControls()
 *
 * function startDrag(event) {
 *   dragControls.start(event, { snapToCursor: true })
 * }
 *
 * return (
 *   <>
 *     <div onPointerDown={startDrag} />
 *     <MotionDiv drag="x" dragControls={dragControls} />
 *   </>
 * )
 * ```
 *
 * @public
 */

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/


/**
* Usually, dragging is initiated by pressing down on a `motion` component with a `drag` prop
* and moving it. For some use-cases, for instance clicking at an arbitrary point on a video scrubber, we
* might want to initiate that dragging from a different component than the draggable one.
*
* By creating a `dragControls` using the `useDragControls` hook, we can pass this into
* the draggable component's `dragControls` prop. It exposes a `start` method
* that can start dragging from pointer events on other components.
*
* @library
*
* ```jsx
* const dragControls = useDragControls()
*
* function startDrag(event) {
*   dragControls.start(event, { snapToCursor: true })
* }
*
* return (
*   <>
    *     <Frame onTapStart={startDrag} />
*     <Frame drag="x" dragControls={dragControls} />
*   </>
* )
* ```
*
* @motion
*
* ```jsx
* const dragControls = useDragControls()
*
* function startDrag(event) {
*   dragControls.start(event, { snapToCursor: true })
* }
*
* return (
*   <>
    *     <div onPointerDown={startDrag} />
*     <MotionDiv drag="x" dragControls={dragControls} />
*   </>
* )
* ```
*
* @public
*/
export const useDragControls = createDragControls