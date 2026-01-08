/**
 * Transform Utilities
 *
 * Parse and build CSS transforms from motion properties
 */

import type { TransformProperties, AnimatableProperties } from '../types/motion.js';

/**
 * Transform property order (important for consistent results)
 */
const transformOrder = [
	'perspective',
	'x',
	'y',
	'z',
	'rotateX',
	'rotateY',
	'rotateZ',
	'rotate',
	'scaleX',
	'scaleY',
	'scaleZ',
	'scale',
	'skewX',
	'skewY'
] as const;

/**
 * Default transform values
 */
const transformDefaults: Record<string, number | string> = {
	x: 0,
	y: 0,
	z: 0,
	rotateX: 0,
	rotateY: 0,
	rotateZ: 0,
	rotate: 0,
	scaleX: 1,
	scaleY: 1,
	scaleZ: 1,
	scale: 1,
	skewX: 0,
	skewY: 0,
	perspective: 0,
	originX: '50%',
	originY: '50%',
	originZ: 0
};

/**
 * Transform keys set for quick lookup
 */
export const transformKeys = new Set<string>(transformOrder);

/**
 * Check if a key is a transform property
 */
export function isTransformKey(key: string): key is keyof TransformProperties {
	return transformKeys.has(key) || key === 'originX' || key === 'originY' || key === 'originZ';
}

/**
 * Parse a value with units
 */
export function parseValue(value: number | string, defaultUnit: string = ''): { value: number; unit: string } {
	if (typeof value === 'number') {
		return { value, unit: defaultUnit };
	}

	const match = value.match(/^(-?[\d.]+)(.*)$/);
	if (match) {
		return { value: parseFloat(match[1]), unit: match[2] || defaultUnit };
	}

	return { value: 0, unit: defaultUnit };
}

/**
 * Get the default unit for a property
 */
export function getDefaultUnit(key: string): string {
	switch (key) {
		case 'x':
		case 'y':
		case 'z':
		case 'perspective':
			return 'px';
		case 'rotateX':
		case 'rotateY':
		case 'rotateZ':
		case 'rotate':
		case 'skewX':
		case 'skewY':
			return 'deg';
		case 'originX':
		case 'originY':
			return '%';
		default:
			return '';
	}
}

/**
 * Format a value with its unit
 */
export function formatValue(key: string, value: number | string): string {
	if (typeof value === 'string') return value;

	const unit = getDefaultUnit(key);
	return `${value}${unit}`;
}

/**
 * Build a CSS transform string from transform properties
 */
export function buildTransform(props: TransformProperties): string {
	const transforms: string[] = [];

	for (const key of transformOrder) {
		const value = props[key];
		if (value === undefined || value === transformDefaults[key]) continue;

		const formatted = formatValue(key, value);

		switch (key) {
			case 'x':
				transforms.push(`translateX(${formatted})`);
				break;
			case 'y':
				transforms.push(`translateY(${formatted})`);
				break;
			case 'z':
				transforms.push(`translateZ(${formatted})`);
				break;
			case 'scale':
				transforms.push(`scale(${value})`);
				break;
			case 'scaleX':
				transforms.push(`scaleX(${value})`);
				break;
			case 'scaleY':
				transforms.push(`scaleY(${value})`);
				break;
			case 'scaleZ':
				transforms.push(`scaleZ(${value})`);
				break;
			case 'rotate':
			case 'rotateZ':
				transforms.push(`rotate(${formatted})`);
				break;
			case 'rotateX':
				transforms.push(`rotateX(${formatted})`);
				break;
			case 'rotateY':
				transforms.push(`rotateY(${formatted})`);
				break;
			case 'skewX':
				transforms.push(`skewX(${formatted})`);
				break;
			case 'skewY':
				transforms.push(`skewY(${formatted})`);
				break;
			case 'perspective':
				transforms.push(`perspective(${formatted})`);
				break;
		}
	}

	return transforms.join(' ');
}

/**
 * Build transform-origin from origin properties
 */
export function buildTransformOrigin(props: TransformProperties): string | undefined {
	const x = props.originX ?? '50%';
	const y = props.originY ?? '50%';
	const z = props.originZ;

	if (x === '50%' && y === '50%' && z === undefined) {
		return undefined;
	}

	const xFormatted = typeof x === 'number' ? `${x}%` : x;
	const yFormatted = typeof y === 'number' ? `${y}%` : y;

	if (z !== undefined) {
		const zFormatted = typeof z === 'number' ? `${z}px` : z;
		return `${xFormatted} ${yFormatted} ${zFormatted}`;
	}

	return `${xFormatted} ${yFormatted}`;
}

/**
 * Split animatable properties into transforms and styles
 */
export function splitProperties(props: AnimatableProperties): {
	transforms: TransformProperties;
	styles: Record<string, any>;
} {
	const transforms: TransformProperties = {};
	const styles: Record<string, any> = {};

	for (const [key, value] of Object.entries(props)) {
		if (isTransformKey(key)) {
			(transforms as any)[key] = value;
		} else {
			styles[key] = value;
		}
	}

	return { transforms, styles };
}

/**
 * Convert camelCase to kebab-case
 */
export function camelToKebab(str: string): string {
	return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * Get computed style value for a property
 */
export function getComputedStyleValue(element: HTMLElement, property: string): string {
	return getComputedStyle(element).getPropertyValue(camelToKebab(property));
}

/**
 * Get the numeric value of a style property
 */
export function getStyleAsNumber(element: HTMLElement, property: string): number {
	const value = getComputedStyleValue(element, property);
	return parseFloat(value) || 0;
}

/**
 * Properties that use pixels as default unit
 */
const pxProperties = new Set([
	'width',
	'height',
	'minWidth',
	'minHeight',
	'maxWidth',
	'maxHeight',
	'padding',
	'paddingTop',
	'paddingRight',
	'paddingBottom',
	'paddingLeft',
	'margin',
	'marginTop',
	'marginRight',
	'marginBottom',
	'marginLeft',
	'top',
	'right',
	'bottom',
	'left',
	'borderRadius',
	'borderWidth',
	'outlineOffset',
	'gap',
	'strokeWidth',
	'strokeDashoffset'
]);

/**
 * Format a style value with appropriate unit
 */
export function formatStyleValue(key: string, value: number | string): string {
	if (typeof value === 'string') return value;
	if (pxProperties.has(key)) return `${value}px`;
	return String(value);
}
