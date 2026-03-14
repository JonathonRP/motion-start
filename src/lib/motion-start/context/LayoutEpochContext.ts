/**
 * Epoch store that AnimatePresence increments whenever its rendered children
 * change.  Measure.svelte subscribes synchronously to snapshot positions and
 * MeasureContextProvider reads it reactively to trigger afterU → flush.
 *
 * `snapshot: true`  — take a FLIP snapshot AND flush (presenceAffectsLayout=true)
 * `snapshot: false` — flush only for exiting elements, no sibling snapshot
 */
import { writable } from 'svelte/store';

export type LayoutEpoch = { n: number; snapshot: boolean };

/** Used as the setContext / getContext key. */
export const LayoutEpochContext = Symbol('LayoutEpochContext');

/** Factory — call once per AnimatePresence instance and set in context. */
export const createLayoutEpoch = () => writable<LayoutEpoch>({ n: 0, snapshot: false });
