/**
 * Shared Layout Attachment
 *
 * Enables shared element transitions across components
 *
 * @example
 * ```svelte
 * <!-- List view -->
 * <div {@attach sharedLayout({ layoutId: `item-${item.id}` })}>
 *   <img src={item.thumbnail} />
 * </div>
 *
 * <!-- Detail view (different component) -->
 * <div {@attach sharedLayout({ layoutId: `item-${item.id}` })}>
 *   <img src={item.fullImage} />
 * </div>
 * ```
 */

import type { TransitionOptions } from '../animation/types.js';
import { getSharedLayoutContext } from '../context/shared-layout.svelte.js';

export type SharedLayoutProps = {
	/** Unique ID for this shared layout element */
	layoutId: string;
	/** Transition for the shared layout animation */
	transition?: TransitionOptions;
};

/**
 * Create a shared layout attachment
 */
export function sharedLayout(props: SharedLayoutProps) {
	return (element: HTMLElement) => {
		const context = getSharedLayoutContext();

		if (!context) {
			console.warn(
				'sharedLayout: No SharedLayoutContext found. ' +
					'Wrap your app in a SharedLayoutProvider component.'
			);
			return () => {};
		}

		// Register this element
		context.register(props.layoutId, element);

		return () => {
			context.unregister(props.layoutId, element);
		};
	};
}
