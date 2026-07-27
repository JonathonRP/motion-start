/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import { prefersReducedMotion } from 'svelte/motion';

// Does this device prefer reduced motion? Returns `null` server-side.
// let prefersReducedMotion: Writable<boolean | null>;

// function initPrefersReducedMotion() {
// 	prefersReducedMotion = motionValue(null);

// 	if (typeof window === 'undefined') return;

// 	if (window.matchMedia) {
// 		const motionMediaQuery = window.matchMedia('(prefers-reduced-motion)');

// 		const setReducedMotionPreferences = () => prefersReducedMotion.set(motionMediaQuery.matches);

// 		motionMediaQuery.addListener(setReducedMotionPreferences);

// 		setReducedMotionPreferences();
// 	} else {
// 		prefersReducedMotion.set(false);
// 	}
// }

/**
 * A hook that returns `true` if we should be using reduced motion based on the current device's Reduced Motion setting.
 *
 * This can be used to implement changes to your UI based on Reduced Motion. For instance, replacing motion-sickness inducing
 * `x`/`y` animations with `opacity`, disabling the autoplay of background videos, or turning off parallax motion.
 *
 * It will actively respond to changes and re-render your components with the latest setting.
 *
 * The returned getter must be called from reactive Svelte code so reads of
 * `prefersReducedMotion.current` remain tracked.
 *
 * ```svelte
 * <script>
 *   import { motion, useReducedMotion } from 'motion-start'
 *
 *   let { isOpen } = $props()
 *   const shouldReduceMotion = useReducedMotion()
 *   const closedX = $derived(shouldReduceMotion() ? 0 : '-100%')
 * </script>
 *
 * <motion.div animate={{
 *   opacity: isOpen ? 1 : 0,
 *   x: isOpen ? 0 : closedX
 * }} />
 * ```
 *
 * @returns A reactive getter for the current reduced-motion preference.
 *
 * @public
 */
export const useReducedMotion = () => {
	return () => prefersReducedMotion.current;
};
