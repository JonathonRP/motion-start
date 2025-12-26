/**
 * Reorder component for drag-to-reorder lists
 * Based on Motion v11.11.11
 *
 * @example
 * ```svelte
 * <script>
 * import { ReorderGroup, ReorderItem } from "motion-start";
 *
 * let items = $state([1, 2, 3, 4]);
 * </script>
 *
 * <ReorderGroup values={items} onReorder={(newOrder) => items = newOrder}>
 *   {#each items as item (item)}
 *     <ReorderItem value={item}>
 *       <div>{item}</div>
 *     </ReorderItem>
 *   {/each}
 * </ReorderGroup>
 * ```
 */

export { default as ReorderGroup } from './ReorderGroup.svelte';
export { default as ReorderItem } from './ReorderItem.svelte';
export type { ReorderGroupProps, ReorderItemProps } from './types.js';
