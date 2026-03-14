/**
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { VariantLabels } from "../motion/types";
import type { Writable } from 'svelte/store'

/**
 * The three possible presence states a child can be in:
 * - AlwaysPresent: no AnimatePresence parent
 * - Present: currently mounted and present
 * - NotPresent: being removed; call safeToRemove when safe to unmount
 * @public
 */
export type PresenceTuple = [true, null] | [true] | [false, () => void];

/**
 * @public
 */
export interface PresenceContextProps {
    id: number;
    presenceKey?: any;
    isPresent: boolean;
    register: (id: number) => () => void;
    onExitComplete?: (id: number) => void;
    initial?: false | VariantLabels;
    custom?: any;

    /**
     * Returns the presenceId and whether initial animations should be blocked.
     * Used by UseVisualElement and UseVisualState when creating/updating visual elements.
     */
    getInitialOptions(): { presenceId: number; blockInitialAnimation: boolean };

    /**
     * Returns true when the visual element is the root of a presence group —
     * i.e. there is no parent, or the parent belongs to a different AnimatePresence.
     * Used by UseVisualElement to set visualElement.isPresenceRoot.
     */
    isPresenceRoot(parentPresenceId?: number): boolean;

    /**
     * Returns the custom data for exit animations.
     * Falls back to the provided value when the context carries no custom data.
     * Used by Exit.svelte to pass the correct custom value to animationState.setActive().
     */
    getCustomData(fallback?: any): any;

    /**
     * Returns the presence tuple for a registered child.
     * Used by usePresence() to reactively expose [isPresent, safeToRemove?] to motion features.
     */
    getPresenceTuple(childId: number): PresenceTuple;
}

import { writable } from "svelte/store";
import { getDomContext } from "./DOMcontext";


/**
 * @public
 */
// @ts-expect-error
export const PresenceContext = (c?: any): Writable<PresenceContextProps | null> => getDomContext("Presence", c) || writable(null);
