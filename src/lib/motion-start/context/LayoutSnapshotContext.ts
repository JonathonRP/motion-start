/** Symbol key for the synchronous snapshot callback registry.
 *
 * AnimatePresence provides a Set<() => void> via setContext.
 * Measure.svelte registers its updater function in this Set.
 * AnimatePresence calls all callbacks synchronously inside its Svelte 4
 * reactive block — before childrenToRender (and thus the DOM) changes —
 * giving Measure the correct "from" position for FLIP layout animations.
 */
export const LayoutSnapshotContext = Symbol('LayoutSnapshotContext');
