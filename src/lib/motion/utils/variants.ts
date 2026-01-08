/**
 * Variants Utilities
 *
 * Resolve variants and animation targets
 */

import type { Variants, Variant, AnimationTarget, VariantLabels } from '../types/motion.js';

/**
 * Resolve a variant label to an animation target
 */
export function resolveVariant(
	variants: Variants | undefined,
	label: string,
	custom?: any
): AnimationTarget | undefined {
	if (!variants) return undefined;

	const variant = variants[label];
	if (!variant) return undefined;

	if (typeof variant === 'function') {
		return variant(custom);
	}

	return variant;
}

/**
 * Resolve variant labels (can be string or array) to animation targets
 */
export function resolveVariantLabels(
	variants: Variants | undefined,
	labels: VariantLabels | undefined,
	custom?: any
): AnimationTarget | undefined {
	if (!labels) return undefined;

	// If it's an object target (not a string label), return as-is
	if (typeof labels === 'object' && !Array.isArray(labels)) {
		return labels as AnimationTarget;
	}

	// Convert single label to array
	const labelArray = Array.isArray(labels) ? labels : [labels];

	// Merge all variant targets
	let merged: AnimationTarget = {};

	for (const label of labelArray) {
		const target = resolveVariant(variants, label, custom);
		if (target) {
			merged = { ...merged, ...target };
		}
	}

	return Object.keys(merged).length > 0 ? merged : undefined;
}

/**
 * Check if a value is a variant label (string or string array)
 */
export function isVariantLabel(value: any): value is VariantLabels {
	return typeof value === 'string' || (Array.isArray(value) && value.every((v) => typeof v === 'string'));
}

/**
 * Get the animation target from props (handles both direct targets and variant labels)
 */
export function getAnimationTarget(
	target: AnimationTarget | VariantLabels | undefined,
	variants: Variants | undefined,
	custom?: any
): AnimationTarget | undefined {
	if (!target) return undefined;

	if (isVariantLabel(target)) {
		return resolveVariantLabels(variants, target, custom);
	}

	return target;
}

/**
 * Check if two animation targets are equal
 */
export function targetsEqual(a: AnimationTarget | undefined, b: AnimationTarget | undefined): boolean {
	if (a === b) return true;
	if (!a || !b) return false;

	const keysA = Object.keys(a).filter((k) => k !== 'transition');
	const keysB = Object.keys(b).filter((k) => k !== 'transition');

	if (keysA.length !== keysB.length) return false;

	return keysA.every((key) => (a as any)[key] === (b as any)[key]);
}

/**
 * Get the changed properties between two targets
 */
export function getChangedProperties(
	from: AnimationTarget | undefined,
	to: AnimationTarget | undefined
): Set<string> {
	const changed = new Set<string>();

	if (!to) return changed;

	const fromObj = from ?? {};

	for (const key of Object.keys(to)) {
		if (key === 'transition') continue;
		if ((fromObj as any)[key] !== (to as any)[key]) {
			changed.add(key);
		}
	}

	return changed;
}

/**
 * Merge multiple animation targets
 */
export function mergeTargets(...targets: (AnimationTarget | undefined)[]): AnimationTarget {
	const merged: AnimationTarget = {};

	for (const target of targets) {
		if (target) {
			Object.assign(merged, target);
		}
	}

	return merged;
}
