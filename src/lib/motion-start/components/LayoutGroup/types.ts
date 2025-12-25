/**
 * LayoutGroup types
 * Based on Motion v11.11.11
 */

import type { Snippet } from 'svelte';

export interface LayoutGroupProps {
    /**
     * A unique ID for the layout group
     * If not provided, one will be generated automatically
     */
    id?: string;

    /**
     * Whether to inherit the parent layout group ID
     * @default true
     */
    inheritId?: boolean;

    /**
     * Children to render within the layout group
     */
    children?: Snippet;

    /**
     * Whether this is a custom element
     * @internal
     */
    isCustom?: boolean;
}
