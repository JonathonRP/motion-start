/**
 * measurePop Attachment
 *
 * Svelte 5 attachment for measuring and preserving layout space during exit animations.
 * Use with {@attach} syntax in templates.
 *
 * @example
 * ```svelte
 * <script>
 *   import { measurePop } from 'motion-start';
 *
 *   let isPresent = $state(true);
 *   const pop = measurePop(() => ({ isPresent }));
 * </script>
 *
 * <div {@attach pop}>
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

export interface MeasurePopAttachment {
	(node: HTMLElement): () => void;
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
 * Creates a measurePop attachment for use with {@attach} syntax
 *
 * @param getOptions - Function that returns current options (reactive)
 * @returns Attachment function for {@attach} directive
 *
 * @example
 * ```svelte
 * <script>
 *   import { measurePop } from 'motion-start';
 *
 *   let isPresent = $state(true);
 *   const pop = measurePop(() => ({ isPresent }));
 * </script>
 *
 * <div {@attach pop}>
 *   <motion.div>Content</motion.div>
 * </div>
 * ```
 */
export function measurePop(
	getOptions: () => MeasurePopOptions
): MeasurePopAttachment {
	return (element: HTMLElement) => {
		let { isPresent, nonce } = getOptions();

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

		// Watch for changes to options
		const updateFromOptions = () => {
			const newOptions = getOptions();
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
		};

		// Initial setup
		updateFromOptions();

		// Set up reactive updates (Svelte will re-run when dependencies change)
		const interval = setInterval(updateFromOptions, 16); // Check every frame

		// Return cleanup function
		return () => {
			clearInterval(interval);
			cleanupStyles();
		};
	};
}

/**
 * Creates a measurePop attachment factory with predefined nonce
 *
 * @param nonce - CSP nonce for injected styles
 * @returns Factory function that creates attachments
 *
 * @example
 * ```svelte
 * <script>
 *   const createPop = createMeasurePop('my-csp-nonce');
 *   let isPresent = $state(true);
 *   const pop = createPop(() => ({ isPresent }));
 * </script>
 *
 * <div {@attach pop}>
 *   <motion.div>Content</motion.div>
 * </div>
 * ```
 */
export function createMeasurePop(
	nonce?: string
): (getOptions: () => Omit<MeasurePopOptions, 'nonce'>) => MeasurePopAttachment {
	return (getOptions: () => Omit<MeasurePopOptions, 'nonce'>) =>
		measurePop(() => ({ ...getOptions(), nonce }));
}
