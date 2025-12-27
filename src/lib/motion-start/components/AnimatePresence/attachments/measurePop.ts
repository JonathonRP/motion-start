/**
 * measurePop Attachment
 *
 * Measures element dimensions before removal and preserves layout space
 * during exit animations. Returns a cleanup function and an update function.
 *
 * This is an imperative attachment pattern for use in $effect blocks.
 *
 * @example
 * ```svelte
 * <script>
 *   import { measurePop } from 'motion-start/components/AnimatePresence/attachments';
 *
 *   let element = $state<HTMLElement>();
 *   let isPresent = $state(true);
 *
 *   $effect(() => {
 *     if (!element) return;
 *     const { cleanup, update } = measurePop(element, { isPresent });
 *
 *     return cleanup;
 *   });
 * </script>
 *
 * <div bind:this={element}>
 *   <motion.div>
 *     Content that will be measured before exit
 *   </motion.div>
 * </div>
 * ```
 */

export interface MeasurePopOptions {
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

interface MeasurePopAttachment {
	/** Updates the attachment with new options */
	update: (options: MeasurePopOptions) => void;
	/** Cleanup function to remove styles and event listeners */
	cleanup: () => void;
}

/**
 * Attaches layout preservation behavior to an element containing a motion component
 *
 * @param element - The DOM element containing the motion component
 * @param options - Configuration options
 * @returns Object with update and cleanup functions
 */
export function measurePop(
	element: HTMLElement,
	options: MeasurePopOptions
): MeasurePopAttachment {
	let { isPresent, nonce } = options;

	let size: Size = { width: 0, height: 0, top: 0, left: 0 };
	let popId = `pop-${Math.random().toString(36).substr(2, 9)}`;
	let prevIsPresent = isPresent;
	let styleElement: HTMLStyleElement | null = null;
	let childElement: HTMLElement | null = null;

	// Find the first child element (should be the motion component)
	const findChildElement = (): HTMLElement | null => {
		return element.firstElementChild as HTMLElement || null;
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
		update(newOptions: MeasurePopOptions) {
			const { isPresent: newIsPresent, nonce: newNonce } = newOptions;

			// Detect transition from present to not present
			if (prevIsPresent && !newIsPresent) {
				measureElement();
			}

			// Update state
			prevIsPresent = newIsPresent;
			isPresent = newIsPresent;
			nonce = newNonce;

			// Apply or remove exit styles
			if (newIsPresent) {
				cleanupStyles();
			} else {
				applyExitStyles();
			}
		},

		cleanup() {
			cleanupStyles();
		}
	};
}

/**
 * Creates a bound measurePop attachment with predefined nonce
 *
 * @param nonce - CSP nonce for injected styles
 * @returns Attachment function that accepts element and isPresent
 *
 * @example
 * ```svelte
 * <script>
 *   const attachMeasurePop = createMeasurePop('my-csp-nonce');
 *
 *   $effect(() => {
 *     if (!element) return;
 *     const { cleanup } = attachMeasurePop(element, { isPresent });
 *     return cleanup;
 *   });
 * </script>
 * ```
 */
export function createMeasurePop(
	nonce?: string
): (element: HTMLElement, options: Omit<MeasurePopOptions, 'nonce'>) => MeasurePopAttachment {
	return (element: HTMLElement, options: Omit<MeasurePopOptions, 'nonce'>) =>
		measurePop(element, { ...options, nonce });
}
