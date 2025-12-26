/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

/**
 * Mode for AnimatePresence to handle entering and exiting children.
 *
 * @public
 */
export type AnimatePresenceMode = "sync" | "wait" | "popLayout";

/**
 * @public
 */
export interface AnimatePresenceProps<T extends {key:any}> {
    /**
     * By passing `initial={false}`, `AnimatePresence` will disable any initial animations on children
     * that are present when the component is first rendered.
     *
     * @motion
     *
     * ```jsx
     * <AnimatePresence initial={false} show={isVisible}>
     *     <MotionDiv
     *       key="modal"
     *       initial={{ opacity: 0 }}
     *       animate={{ opacity: 1 }}
     *       exit={{ opacity: 0 }}
     *     />
     * </AnimatePresence>
     * ```
     *
     * @public
     */
    initial?: boolean;
    /**
     * When a component is removed, there's no longer a chance to update its props. So if a component's `exit`
     * prop is defined as a dynamic variant and you want to pass a new `custom` prop, you can do so via `AnimatePresence`.
     * This will ensure all leaving components animate using the latest data.
     *
     * @public
     */
    custom?: any;
    /**
     * Fires when all exiting nodes have completed animating out.
     *
     * @public
     */
    onExitComplete?: () => void;
    /**
     * Determines how AnimatePresence handles entering and exiting children.
     *
     * - "sync" (default): Exiting elements removed as exit animation finishes
     * - "wait": Only renders one component at a time. The exiting component finishes its exit animation before the entering component is rendered.
     * - "popLayout": Exiting elements are "popped" from layout using position: absolute
     *
     * @motion
     *
     * ```jsx
     * <AnimatePresence mode="wait">
     *   <MotionDiv key={currentItem} exit={{ opacity: 0 }} />
     * </AnimatePresence>
     * ```
     *
     * @public
     */
    mode?: AnimatePresenceMode;
    /**
     * If set to `true`, `AnimatePresence` will only render one component at a time. The exiting component
     * will finished its exit animation before the entering component is rendered.
     *
     * @deprecated Use `mode="wait"` instead
     *
     * @motion
     *
     * ```jsx
     * const MyComponent = ({ currentItem }) => (
     *   <AnimatePresence exitBeforeEnter>
     *     <MotionDiv key={currentItem} exit={{ opacity: 0 }} />
     *   </AnimatePresence>
     * )
     * ```
     *
     * @beta
     */
    exitBeforeEnter?: boolean;
    /**
     * Used in Framer to flag that sibling children *shouldn't* re-render as a result of a
     * child being removed.
     *
     * @internal
     */
    presenceAffectsLayout?: boolean;
    /**
     * The data array for the items you want to render. Every Item needs a unique `key`.
     * 
     * Alternatively, you can leave this undefined and supply `show` prop.
     */
    list?:T[]
    /**
     * Render the child when this is set to `true`, exit it when changed to `false`.
     * 
     * Only used when list is undefined.
     */
    show?: boolean
}
