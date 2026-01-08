/**
 * Layout Group Context
 *
 * Modern replacement for deprecated AnimateSharedLayout/SharedLayoutProvider
 *
 * LayoutGroup serves two purposes:
 * 1. Namespace layoutId to allow reusable components on the same page
 * 2. Group sibling components that perform distinct layout animations
 *
 * Uses Svelte 5's type-safe createContext API
 */

import { createContext } from 'svelte';
import type { TransitionOptions } from '../animation/types.js';
import { animate } from '../animation/animate.js';

export type LayoutGroupContextValue = {
	/** Group ID for namespacing layoutIds */
	id?: string;
	/** Register an element with a layoutId */
	register: (layoutId: string, element: HTMLElement) => void;
	/** Unregister an element */
	unregister: (layoutId: string, element: HTMLElement) => void;
	/** Force a layout measurement pass */
	forceUpdate: () => void;
	/** Default transition for layout animations */
	transition?: TransitionOptions;
};

type ElementSnapshot = {
	element: HTMLElement;
	box: DOMRect;
	borderRadius: string;
	opacity: number;
	backgroundColor: string;
};

/**
 * Type-safe context for layout groups
 */
export const [getLayoutGroupContext, setLayoutGroupContext] = createContext<LayoutGroupContextValue>();

/**
 * Safely get layout group context (returns undefined if not in context)
 */
export function useLayoutGroupContext(): LayoutGroupContextValue | undefined {
	try {
		return getLayoutGroupContext();
	} catch {
		return undefined;
	}
}

/**
 * Global layout state for elements not in a LayoutGroup
 * This enables layoutId to work globally across the app
 */
const globalLayoutState = {
	elements: new Map<string, HTMLElement>(),
	snapshots: new Map<string, ElementSnapshot>()
};

/**
 * Create a layout group state
 */
export function createLayoutGroupState(options?: { id?: string; transition?: TransitionOptions }) {
	// Map of layoutId -> current element
	const elements = new Map<string, HTMLElement>();
	// Map of layoutId -> previous snapshot
	const snapshots = new Map<string, ElementSnapshot>();

	function getSnapshot(element: HTMLElement): ElementSnapshot {
		const box = element.getBoundingClientRect();
		const computed = getComputedStyle(element);

		return {
			element,
			box,
			borderRadius: computed.borderRadius,
			opacity: parseFloat(computed.opacity) || 1,
			backgroundColor: computed.backgroundColor
		};
	}

	function getNamespacedId(layoutId: string): string {
		return options?.id ? `${options.id}-${layoutId}` : layoutId;
	}

	function register(layoutId: string, element: HTMLElement) {
		const nsId = getNamespacedId(layoutId);
		const existing = elements.get(nsId);

		if (existing && existing !== element) {
			// Snapshot the outgoing element for shared element transition
			snapshots.set(nsId, getSnapshot(existing));
		}

		elements.set(nsId, element);

		// Check if we have a snapshot to animate from
		const snapshot = snapshots.get(nsId);
		if (snapshot && snapshot.element !== element) {
			animateLayoutTransition(snapshot, element, options?.transition);
			snapshots.delete(nsId);
		}
	}

	function unregister(layoutId: string, element: HTMLElement) {
		const nsId = getNamespacedId(layoutId);
		const current = elements.get(nsId);

		if (current === element) {
			// Take snapshot before removal for potential shared transition
			snapshots.set(nsId, getSnapshot(element));
			elements.delete(nsId);
		}
	}

	function forceUpdate() {
		// Snapshot all current elements
		for (const [nsId, element] of elements) {
			snapshots.set(nsId, getSnapshot(element));
		}
	}

	const context: LayoutGroupContextValue = {
		id: options?.id,
		register,
		unregister,
		forceUpdate,
		transition: options?.transition
	};

	// Set the context
	setLayoutGroupContext(context);

	return {
		context,
		/** Get all registered elements */
		get elements() {
			return elements;
		},
		/** Force update all elements */
		forceUpdate
	};
}

/**
 * Register a layout element (works with or without LayoutGroup)
 */
export function registerLayoutElement(layoutId: string, element: HTMLElement) {
	const context = useLayoutGroupContext();

	if (context) {
		context.register(layoutId, element);
	} else {
		// Use global layout state
		const existing = globalLayoutState.elements.get(layoutId);

		if (existing && existing !== element) {
			const box = existing.getBoundingClientRect();
			const computed = getComputedStyle(existing);
			globalLayoutState.snapshots.set(layoutId, {
				element: existing,
				box,
				borderRadius: computed.borderRadius,
				opacity: parseFloat(computed.opacity) || 1,
				backgroundColor: computed.backgroundColor
			});
		}

		globalLayoutState.elements.set(layoutId, element);

		// Check for existing snapshot
		const snapshot = globalLayoutState.snapshots.get(layoutId);
		if (snapshot && snapshot.element !== element) {
			animateLayoutTransition(snapshot, element);
			globalLayoutState.snapshots.delete(layoutId);
		}
	}
}

/**
 * Unregister a layout element
 */
export function unregisterLayoutElement(layoutId: string, element: HTMLElement) {
	const context = useLayoutGroupContext();

	if (context) {
		context.unregister(layoutId, element);
	} else {
		const current = globalLayoutState.elements.get(layoutId);
		if (current === element) {
			const box = element.getBoundingClientRect();
			const computed = getComputedStyle(element);
			globalLayoutState.snapshots.set(layoutId, {
				element,
				box,
				borderRadius: computed.borderRadius,
				opacity: parseFloat(computed.opacity) || 1,
				backgroundColor: computed.backgroundColor
			});
			globalLayoutState.elements.delete(layoutId);
		}
	}
}

/**
 * Animate the layout transition between two elements
 */
function animateLayoutTransition(
	fromSnapshot: ElementSnapshot,
	toElement: HTMLElement,
	transition?: TransitionOptions
) {
	const toBox = toElement.getBoundingClientRect();
	const toComputed = getComputedStyle(toElement);

	const defaultTransition: TransitionOptions = transition ?? {
		type: 'spring',
		stiffness: 400,
		damping: 30
	};

	// Calculate deltas
	const deltaX = fromSnapshot.box.left - toBox.left;
	const deltaY = fromSnapshot.box.top - toBox.top;
	const scaleX = fromSnapshot.box.width / toBox.width || 1;
	const scaleY = fromSnapshot.box.height / toBox.height || 1;

	// Skip if no significant change
	if (
		Math.abs(deltaX) < 0.5 &&
		Math.abs(deltaY) < 0.5 &&
		Math.abs(scaleX - 1) < 0.01 &&
		Math.abs(scaleY - 1) < 0.01
	) {
		return;
	}

	// Current animation values
	let currentX = deltaX;
	let currentY = deltaY;
	let currentScaleX = scaleX;
	let currentScaleY = scaleY;

	function applyTransform() {
		toElement.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScaleX}, ${currentScaleY})`;
	}

	// Set transform origin to top-left for accurate scaling
	const originalTransformOrigin = toElement.style.transformOrigin;
	toElement.style.transformOrigin = '0 0';

	applyTransform();

	// Animate position
	if (Math.abs(deltaX) >= 0.5) {
		animate(deltaX, 0, {
			...defaultTransition,
			onUpdate: (v) => {
				currentX = v;
				applyTransform();
			}
		});
	}

	if (Math.abs(deltaY) >= 0.5) {
		animate(deltaY, 0, {
			...defaultTransition,
			onUpdate: (v) => {
				currentY = v;
				applyTransform();
			}
		});
	}

	// Animate scale
	if (Math.abs(scaleX - 1) >= 0.01) {
		animate(scaleX, 1, {
			...defaultTransition,
			onUpdate: (v) => {
				currentScaleX = v;
				applyTransform();
			}
		});
	}

	if (Math.abs(scaleY - 1) >= 0.01) {
		animate(scaleY, 1, {
			...defaultTransition,
			onUpdate: (v) => {
				currentScaleY = v;
				applyTransform();
			},
			onComplete: () => {
				toElement.style.transform = '';
				toElement.style.transformOrigin = originalTransformOrigin;
			}
		});
	} else {
		// If no scale animation, clean up after position animations
		setTimeout(() => {
			toElement.style.transform = '';
			toElement.style.transformOrigin = originalTransformOrigin;
		}, 500);
	}

	// Animate border radius if different
	const fromRadius = parseFloat(fromSnapshot.borderRadius) || 0;
	const toRadius = parseFloat(toComputed.borderRadius) || 0;

	if (Math.abs(fromRadius - toRadius) > 1) {
		toElement.style.borderRadius = `${fromRadius}px`;
		animate(fromRadius, toRadius, {
			...defaultTransition,
			onUpdate: (v) => {
				toElement.style.borderRadius = `${v}px`;
			},
			onComplete: () => {
				toElement.style.borderRadius = '';
			}
		});
	}
}
