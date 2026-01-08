/**
 * Transform Utilities Tests
 *
 * Ported from motiondivision/motion test patterns
 */

import { describe, it, expect } from 'vitest';
import {
	buildTransform,
	buildTransformOrigin,
	splitProperties,
	isTransformKey,
	parseValue,
	getDefaultUnit,
	formatStyleValue,
	camelToKebab,
	transformKeys
} from './transforms.js';

describe('buildTransform', () => {
	it('should return empty string for empty props', () => {
		expect(buildTransform({})).toBe('');
	});

	it('should build translateX from x', () => {
		expect(buildTransform({ x: 100 })).toBe('translateX(100px)');
	});

	it('should build translateY from y', () => {
		expect(buildTransform({ y: 50 })).toBe('translateY(50px)');
	});

	it('should build translateZ from z', () => {
		expect(buildTransform({ z: 25 })).toBe('translateZ(25px)');
	});

	it('should build scale', () => {
		expect(buildTransform({ scale: 1.5 })).toBe('scale(1.5)');
	});

	it('should build scaleX', () => {
		expect(buildTransform({ scaleX: 2 })).toBe('scaleX(2)');
	});

	it('should build scaleY', () => {
		expect(buildTransform({ scaleY: 0.5 })).toBe('scaleY(0.5)');
	});

	it('should build rotate with degrees', () => {
		expect(buildTransform({ rotate: 45 })).toBe('rotate(45deg)');
	});

	it('should build rotateX', () => {
		expect(buildTransform({ rotateX: 30 })).toBe('rotateX(30deg)');
	});

	it('should build rotateY', () => {
		expect(buildTransform({ rotateY: 60 })).toBe('rotateY(60deg)');
	});

	it('should build skewX', () => {
		expect(buildTransform({ skewX: 10 })).toBe('skewX(10deg)');
	});

	it('should build skewY', () => {
		expect(buildTransform({ skewY: 15 })).toBe('skewY(15deg)');
	});

	it('should build perspective', () => {
		expect(buildTransform({ perspective: 1000 })).toBe('perspective(1000px)');
	});

	it('should combine multiple transforms in correct order', () => {
		const result = buildTransform({
			x: 100,
			y: 50,
			scale: 1.2,
			rotate: 45
		});

		// Should be in transform order: x, y, rotate, scale
		expect(result).toBe('translateX(100px) translateY(50px) rotate(45deg) scale(1.2)');
	});

	it('should skip default values', () => {
		expect(buildTransform({ x: 0 })).toBe('');
		expect(buildTransform({ scale: 1 })).toBe('');
		expect(buildTransform({ rotate: 0 })).toBe('');
	});

	it('should handle string values', () => {
		expect(buildTransform({ x: '10rem' })).toBe('translateX(10rem)');
		expect(buildTransform({ rotate: '0.5turn' })).toBe('rotate(0.5turn)');
	});
});

describe('buildTransformOrigin', () => {
	it('should return undefined for default origin', () => {
		expect(buildTransformOrigin({})).toBeUndefined();
		expect(buildTransformOrigin({ originX: '50%', originY: '50%' })).toBeUndefined();
	});

	it('should build custom origin', () => {
		expect(buildTransformOrigin({ originX: '0%', originY: '0%' })).toBe('0% 0%');
	});

	it('should handle numeric values', () => {
		expect(buildTransformOrigin({ originX: 0, originY: 100 })).toBe('0% 100%');
	});

	it('should include z when provided', () => {
		expect(buildTransformOrigin({ originX: '50%', originY: '50%', originZ: 100 })).toBe(
			'50% 50% 100px'
		);
	});
});

describe('splitProperties', () => {
	it('should split transform and style properties', () => {
		const { transforms, styles } = splitProperties({
			x: 100,
			y: 50,
			opacity: 0.5,
			backgroundColor: 'red'
		});

		expect(transforms).toEqual({ x: 100, y: 50 });
		expect(styles).toEqual({ opacity: 0.5, backgroundColor: 'red' });
	});

	it('should handle empty input', () => {
		const { transforms, styles } = splitProperties({});

		expect(transforms).toEqual({});
		expect(styles).toEqual({});
	});

	it('should handle only transforms', () => {
		const { transforms, styles } = splitProperties({
			x: 100,
			scale: 1.5,
			rotate: 45
		});

		expect(transforms).toEqual({ x: 100, scale: 1.5, rotate: 45 });
		expect(styles).toEqual({});
	});

	it('should handle only styles', () => {
		const { transforms, styles } = splitProperties({
			opacity: 0.8,
			color: 'blue'
		});

		expect(transforms).toEqual({});
		expect(styles).toEqual({ opacity: 0.8, color: 'blue' });
	});
});

describe('isTransformKey', () => {
	it('should return true for transform keys', () => {
		expect(isTransformKey('x')).toBe(true);
		expect(isTransformKey('y')).toBe(true);
		expect(isTransformKey('z')).toBe(true);
		expect(isTransformKey('scale')).toBe(true);
		expect(isTransformKey('scaleX')).toBe(true);
		expect(isTransformKey('scaleY')).toBe(true);
		expect(isTransformKey('rotate')).toBe(true);
		expect(isTransformKey('rotateX')).toBe(true);
		expect(isTransformKey('rotateY')).toBe(true);
		expect(isTransformKey('rotateZ')).toBe(true);
		expect(isTransformKey('skewX')).toBe(true);
		expect(isTransformKey('skewY')).toBe(true);
		expect(isTransformKey('perspective')).toBe(true);
	});

	it('should return true for origin keys', () => {
		expect(isTransformKey('originX')).toBe(true);
		expect(isTransformKey('originY')).toBe(true);
		expect(isTransformKey('originZ')).toBe(true);
	});

	it('should return false for style keys', () => {
		expect(isTransformKey('opacity')).toBe(false);
		expect(isTransformKey('backgroundColor')).toBe(false);
		expect(isTransformKey('color')).toBe(false);
		expect(isTransformKey('width')).toBe(false);
		expect(isTransformKey('height')).toBe(false);
	});
});

describe('parseValue', () => {
	it('should parse numeric values', () => {
		expect(parseValue(100)).toEqual({ value: 100, unit: '' });
		expect(parseValue(100, 'px')).toEqual({ value: 100, unit: 'px' });
	});

	it('should parse string values with units', () => {
		expect(parseValue('100px')).toEqual({ value: 100, unit: 'px' });
		expect(parseValue('50%')).toEqual({ value: 50, unit: '%' });
		expect(parseValue('1.5rem')).toEqual({ value: 1.5, unit: 'rem' });
		expect(parseValue('45deg')).toEqual({ value: 45, unit: 'deg' });
	});

	it('should parse negative values', () => {
		expect(parseValue('-100px')).toEqual({ value: -100, unit: 'px' });
		expect(parseValue(-50)).toEqual({ value: -50, unit: '' });
	});

	it('should parse decimal values', () => {
		expect(parseValue('0.5em')).toEqual({ value: 0.5, unit: 'em' });
		expect(parseValue('.75vh')).toEqual({ value: 0.75, unit: 'vh' });
	});

	it('should use default unit when no unit provided', () => {
		expect(parseValue('100', 'px')).toEqual({ value: 100, unit: 'px' });
	});
});

describe('getDefaultUnit', () => {
	it('should return px for position transforms', () => {
		expect(getDefaultUnit('x')).toBe('px');
		expect(getDefaultUnit('y')).toBe('px');
		expect(getDefaultUnit('z')).toBe('px');
		expect(getDefaultUnit('perspective')).toBe('px');
	});

	it('should return deg for rotation transforms', () => {
		expect(getDefaultUnit('rotate')).toBe('deg');
		expect(getDefaultUnit('rotateX')).toBe('deg');
		expect(getDefaultUnit('rotateY')).toBe('deg');
		expect(getDefaultUnit('rotateZ')).toBe('deg');
		expect(getDefaultUnit('skewX')).toBe('deg');
		expect(getDefaultUnit('skewY')).toBe('deg');
	});

	it('should return % for origin', () => {
		expect(getDefaultUnit('originX')).toBe('%');
		expect(getDefaultUnit('originY')).toBe('%');
	});

	it('should return empty string for scale', () => {
		expect(getDefaultUnit('scale')).toBe('');
		expect(getDefaultUnit('scaleX')).toBe('');
		expect(getDefaultUnit('scaleY')).toBe('');
	});

	it('should return empty string for unknown properties', () => {
		expect(getDefaultUnit('opacity')).toBe('');
		expect(getDefaultUnit('color')).toBe('');
	});
});

describe('formatStyleValue', () => {
	it('should return string values as-is', () => {
		expect(formatStyleValue('width', '100%')).toBe('100%');
		expect(formatStyleValue('color', 'red')).toBe('red');
	});

	it('should add px to pixel properties', () => {
		expect(formatStyleValue('width', 100)).toBe('100px');
		expect(formatStyleValue('height', 50)).toBe('50px');
		expect(formatStyleValue('padding', 10)).toBe('10px');
		expect(formatStyleValue('margin', 20)).toBe('20px');
		expect(formatStyleValue('borderRadius', 5)).toBe('5px');
	});

	it('should not add unit to non-pixel properties', () => {
		expect(formatStyleValue('opacity', 0.5)).toBe('0.5');
		expect(formatStyleValue('zIndex', 10)).toBe('10');
	});
});

describe('camelToKebab', () => {
	it('should convert camelCase to kebab-case', () => {
		expect(camelToKebab('backgroundColor')).toBe('background-color');
		expect(camelToKebab('borderRadius')).toBe('border-radius');
		expect(camelToKebab('marginTop')).toBe('margin-top');
	});

	it('should handle single word', () => {
		expect(camelToKebab('opacity')).toBe('opacity');
		expect(camelToKebab('color')).toBe('color');
	});

	it('should handle multiple capitals', () => {
		expect(camelToKebab('webkitTransform')).toBe('webkit-transform');
		expect(camelToKebab('borderTopLeftRadius')).toBe('border-top-left-radius');
	});
});

describe('transformKeys', () => {
	it('should be a Set', () => {
		expect(transformKeys).toBeInstanceOf(Set);
	});

	it('should contain all transform keys', () => {
		expect(transformKeys.has('x')).toBe(true);
		expect(transformKeys.has('y')).toBe(true);
		expect(transformKeys.has('z')).toBe(true);
		expect(transformKeys.has('scale')).toBe(true);
		expect(transformKeys.has('rotate')).toBe(true);
	});
});
