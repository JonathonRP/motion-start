import { isBrowser } from '../is-browser.js';

/**
 * Reduced motion state interface
 */
export interface ReducedMotionState {
	current: boolean | null;
}

/**
 * Global state for reduced motion preference
 * Null on servers, boolean in browser
 */
export const prefersReducedMotion: ReducedMotionState = { current: null };

/**
 * Track whether we've set up the reduced motion listener
 */
export const hasReducedMotionListener = { current: false };

/**
 * Initializes the reduced motion preference detection
 * Sets up a media query listener to detect user's motion preferences
 */
export function initPrefersReducedMotion() {
	hasReducedMotionListener.current = true;

	if (!isBrowser) return;

	if (window.matchMedia) {
		const motionMediaQuery = window.matchMedia('(prefers-reduced-motion)');

		const setReducedMotionPreferences = () => {
			prefersReducedMotion.current = motionMediaQuery.matches;
		};

		motionMediaQuery.addListener(setReducedMotionPreferences);
		setReducedMotionPreferences();
	} else {
		prefersReducedMotion.current = false;
	}
}
