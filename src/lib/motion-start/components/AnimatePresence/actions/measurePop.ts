/**
 * measurePop Svelte Action
 *
 * Measures element dimensions before removal and preserves layout space
 * during exit animations. This is the action-based version of PopChild.
 *
 * Used with AnimatePresence popLayout mode to prevent layout shift when
 * elements exit.
 *
 * @example
 * ```svelte
 * <script>
 *   import { measurePop } from 'motion-start/components/AnimatePresence/actions';
 *   let isPresent = $state(true);
 * </script>
 *
 * <div use:measurePop={{ isPresent, nonce: 'optional-csp-nonce' }}>
 *   <motion.div>
 *     Content that will be measured before exit
 *   </motion.div>
 * </div>
 * ```
 */

import type { Action } from 'svelte/action';

export interface MeasurePopParameters {
	/** Whether the element is currently present (mounted) */
	isPresent: boolean;
	/** Optional CSP nonce for the injected style element */
	nonce?: string;
}

interface Size {
	width: number;
	height: number;
	top: number;
	left: number;
}

/**
 * Svelte action that measures and preserves layout during exit animations
 *
 * @param node - The DOM element containing the motion component
 * @param params - Configuration object
 * @returns Action object with update and destroy methods
 */
export const measurePop: Action<HTMLElement, MeasurePopParameters> = (node, params) => {
	const { isPresent, nonce } = params || { isPresent: true };

	let size: Size = { width: 0, height: 0, top: 0, left: 0 };
	let popId = `pop-${Math.random().toString(36).substr(2, 9)}`;
	let prevIsPresent = isPresent;
	let styleElement: HTMLStyleElement | null = null;
	let childElement: HTMLElement | null = null;

	// Find the first child element (should be the motion component)
	const findChildElement = (): HTMLElement | null => {
		// Look for direct child or first element child
		return node.firstElementChild as HTMLElement || null;
	};

	// Measure element before exit
	const measureElement = () => {
		childElement = findChildElement();

		if (!childElement) return;

		size = {
			width: childElement.offsetWidth || 0,
			height: childElement.offsetHeight || 0,
			top: childElement.offsetTop,
			left: childElement.offsetLeft,
		};
	};

	// Apply absolute positioning during exit
	const applyExitStyles = () => {
		childElement = findChildElement();

		if (!childElement || isPresent || !size.width || !size.height) {
			cleanupStyles();
			return;
		}

		// Mark element with unique ID
		childElement.dataset.motionPopId = popId;

		// Create and inject style element
		const style = document.createElement('style');
		if (nonce) {
			style.nonce = nonce;
		}
		document.head.appendChild(style);
		styleElement = style;

		// Insert positioning rules
		if (style.sheet) {
			style.sheet.insertRule(`
				[data-motion-pop-id="${popId}"] {
					position: absolute !important;
					width: ${size.width}px !important;
					height: ${size.height}px !important;
					top: ${size.top}px !important;
					left: ${size.left}px !important;
				}
			`);
		}
	};

	// Clean up injected styles
	const cleanupStyles = () => {
		if (styleElement && styleElement.parentNode) {
			document.head.removeChild(styleElement);
			styleElement = null;
		}

		if (childElement) {
			delete childElement.dataset.motionPopId;
		}
	};

	// Initial setup
	if (prevIsPresent && !isPresent) {
		measureElement();
		applyExitStyles();
	}

	return {
		update(newParams: MeasurePopParameters) {
			const { isPresent: newIsPresent, nonce: newNonce } = newParams || { isPresent: true };

			// Detect transition from present to not present
			if (prevIsPresent && !newIsPresent) {
				measureElement();
			}

			// Update state
			prevIsPresent = newIsPresent;

			// Apply or remove exit styles
			if (newIsPresent) {
				cleanupStyles();
			} else {
				applyExitStyles();
			}
		},

		destroy() {
			cleanupStyles();
		}
	};
};

/**
 * Factory function to create a measurePop action with bound nonce
 *
 * @example
 * ```svelte
 * <script>
 *   const popWithNonce = createMeasurePop('my-csp-nonce');
 * </script>
 *
 * <div use:popWithNonce={{ isPresent }}>...</div>
 * ```
 */
export function createMeasurePop(nonce?: string): Action<HTMLElement, { isPresent: boolean }> {
	return (node, params) => {
		return measurePop(node, { ...params, nonce });
	};
}
