/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
export type { AnimatePresenceProps } from './types.js';
/**
 * Framer Motion removed the legacy ConditionalGeneric helper before v11.11.11.
 * Motion Start intentionally follows that public API.
 */
/**
 * `AnimatePresence` enables the animation of components that have been removed from the tree.
 *
 * Use Svelte's keyed `{#each}` and `{#if}` blocks to express child identity and
 * lifetime. Motion elements with an `exit` prop automatically bridge their
 * Svelte outro into Motion's exit feature.
 *
 * @motion
 *
 * Any `motion` components that have an `exit` property defined will animate out when removed from
 * the tree.
 *
 * ```jsx
 * import { motion, AnimatePresence } from 'svelte-motion'
 * <AnimatePresence>
 *   {#each items as item (item.id)}
 *     <motion.div exit={{ opacity: 0 }}>{item.label}</motion.div>
 *   {/each}
 * </AnimatePresence>
 * ```
 *
 * You can sequence exit animations throughout a tree using variants.
 *
 * If a child contains multiple `Motion` components with `exit` props, it will only unmount the child
 * once all `motion` components have finished animating out. Likewise, any components using
 * `usePresence` all need to call `safeToRemove`.
 *
 * @public
 */
export { default as AnimatePresence } from './AnimatePresence.svelte';
export { PresenceChild } from './PresenceChild/index.js';
