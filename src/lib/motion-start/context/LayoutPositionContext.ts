/** Symbol key for the position:absolute callback registry.
 *
 * AnimatePresence provides a Map<presenceKey, () => void> via setContext.
 * AnimateLayoutContextProvider registers its applyAbsolute callback keyed by presenceKey.
 * AnimatePresence calls positionRegistry.get(exitingKey)?.() after the snapshot and
 * before the epoch update, so the exiting element is removed from layout flow before
 * remaining elements' FLIP "to" positions are measured.
 */
export const LayoutPositionContext = Symbol('LayoutPositionContext');
