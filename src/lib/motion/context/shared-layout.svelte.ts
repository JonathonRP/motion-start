/**
 * Shared Layout Context
 *
 * Enables cross-component layout animations using layoutId
 */

import { getContext, setContext } from 'svelte';
import type { TransitionOptions } from '../animation/types.js';
import { animate } from '../animation/animate.js';

const SHARED_LAYOUT_CONTEXT = Symbol('shared-layout');

type ElementSnapshot = {
	element: HTMLElement;
	box: DOMRect;
	borderRadius: string;
	opacity: number;
};

type SharedLayoutContextValue = {
	/** Register an element with a layoutId */
	register: (layoutId: string, element: HTMLElement) => void;
	/** Unregister an element */
	unregister: (layoutId: string, element: HTMLElement) => void;
	/** Force sync (snapshot and animate) */
	forceSync: () => void;
	/** Get transition config */
	transition?: TransitionOptions;
};

/**
 * Create shared layout context
 */
export function createSharedLayoutContext(options?: { transition?: TransitionOptions }) {
	// Map of layoutId -> current element
	const elements = new Map<string, HTMLElement>();
	// Map of layoutId -> previous snapshot
	const snapshots = new Map<string, ElementSnapshot>();
	// Clone elements for crossfade effect
	const clones = new Map<string, HTMLElement>();

	function getSnapshot(element: HTMLElement): ElementSnapshot {
		const box = element.getBoundingClientRect();
		const computed = getComputedStyle(element);

		return {
			element,
			box,
			borderRadius: computed.borderRadius,
			opacity: parseFloat(computed.opacity)
		};
	}

	function register(layoutId: string, element: HTMLElement) {
		const existing = elements.get(layoutId);

		if (existing && existing !== element) {
			// Snapshot the outgoing element
			snapshots.set(layoutId, getSnapshot(existing));
		}

		elements.set(layoutId, element);

		// Check if we have a snapshot to animate from
		const snapshot = snapshots.get(layoutId);
		if (snapshot) {
			animateLayoutTransition(layoutId, snapshot, element, options?.transition);
			snapshots.delete(layoutId);
		}
	}

	function unregister(layoutId: string, element: HTMLElement) {
		const current = elements.get(layoutId);
		if (current === element) {
			// Take snapshot before removal
			snapshots.set(layoutId, getSnapshot(element));
			elements.delete(layoutId);
		}
	}

	function forceSync() {
		// Snapshot all current elements
		for (const [layoutId, element] of elements) {
			snapshots.set(layoutId, getSnapshot(element));
		}
	}

	const context: SharedLayoutContextValue = {
		register,
		unregister,
		forceSync,
		transition: options?.transition
	};

	setContext(SHARED_LAYOUT_CONTEXT, context);

	return context;
}

/**
 * Get shared layout context
 */
export function getSharedLayoutContext(): SharedLayoutContextValue | undefined {
	return getContext<SharedLayoutContextValue>(SHARED_LAYOUT_CONTEXT);
}

/**
 * Animate the layout transition between two elements
 */
function animateLayoutTransition(
	layoutId: string,
	fromSnapshot: ElementSnapshot,
	toElement: HTMLElement,
	transition?: TransitionOptions
) {
	const toBox = toElement.getBoundingClientRect();
	const toComputed = getComputedStyle(toElement);

	const defaultTransition: TransitionOptions = transition ?? {
		type: 'spring',
		stiffness: 500,
		damping: 30
	};

	// Calculate deltas
	const deltaX = fromSnapshot.box.left - toBox.left;
	const deltaY = fromSnapshot.box.top - toBox.top;
	const scaleX = fromSnapshot.box.width / toBox.width;
	const scaleY = fromSnapshot.box.height / toBox.height;

	// Apply initial transform
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
	animate(deltaX, 0, {
		...defaultTransition,
		onUpdate: (v) => {
			currentX = v;
			applyTransform();
		}
	});

	animate(deltaY, 0, {
		...defaultTransition,
		onUpdate: (v) => {
			currentY = v;
			applyTransform();
		}
	});

	// Animate scale
	animate(scaleX, 1, {
		...defaultTransition,
		onUpdate: (v) => {
			currentScaleX = v;
			applyTransform();
		}
	});

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

	// Animate border radius if different
	if (fromSnapshot.borderRadius !== toComputed.borderRadius) {
		// Parse border radius values
		const fromRadius = parseFloat(fromSnapshot.borderRadius) || 0;
		const toRadius = parseFloat(toComputed.borderRadius) || 0;

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
