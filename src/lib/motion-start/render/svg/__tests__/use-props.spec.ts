/**
 * based on framer-motion@11.11.11,
 * Copyright (c) 2018 Framer B.V.
 */

import { describe, test, expect } from 'vitest';
import { motionValue } from '../../../value';
import { useSvgProps } from '../use-props.svelte';

describe('SVG useProps', () => {
	test('should return correct styles for element', () => {
		const result = useSvgProps(
			() =>
				({
					attrX: 1,
					attrY: motionValue(5),
					attrScale: 3,
					cx: 2,
					style: {
						x: 3,
						scale: 4,
					},
				}) as any,
			() => ({
				attrX: 6,
				attrY: 10,
				attrScale: 4,
				cx: 7,
				x: 8,
				scale: 9,
			}),
			false,
			'path'
		);

		expect(result()).toStrictEqual({
			x: 6,
			y: 10,
			scale: 4,
			cx: 7,
			style: {},
		});
	});

	test('should return correct styles for element with pathLength', () => {
		const result = useSvgProps(
			() => ({ style: {} }) as any,
			() => ({
				pathLength: 0.5,
			}),
			false,
			'path'
		);

		expect(result()).toStrictEqual({
			pathLength: 1,
			strokeDasharray: '0.5px 1px',
			strokeDashoffset: '0px',
			style: {},
		});
	});

	test('should correctly remove props as motionvalues', () => {
		const result = useSvgProps(
			() => ({ y: motionValue(2) }) as any,
			() => ({ attrY: 3 }),
			false,
			'path'
		);

		expect(result()).toStrictEqual({
			y: 3,
			style: {},
		});
	});
});
