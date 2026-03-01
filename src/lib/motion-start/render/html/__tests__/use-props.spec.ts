/**
 * based on framer-motion@11.11.11,
 * Copyright (c) 2018 Framer B.V.
 */

import { describe, test, expect } from 'vitest';
import { motionValue } from '../../../value';
import { useHTMLProps } from '../use-props.svelte';

describe('HTML useProps', () => {
	test('should return correct styles for element', () => {
		const result = useHTMLProps(
			() => ({
				style: {
					x: motionValue(1),
					y: motionValue(2),
				},
			}),
			() => ({
				x: 3,
			})
		);

		expect(result()).toEqual({
			style: { transform: 'translateX(3px)' },
		});
	});

	test('should disable hardware acceleration in isStatic mode', () => {
		const result = useHTMLProps(
			() => ({
				style: {
					x: motionValue(1),
					y: motionValue(2),
				},
			}),
			() => ({
				x: 3,
			})
		);

		expect(result()).toEqual({
			style: { transform: 'translateX(3px)' },
		});
	});

	test('should generate new styles when a new visualState object is passed', () => {
		const initialState = { x: 100 };

		const result1 = useHTMLProps(() => ({}), () => initialState);
		const a = result1().style;

		const result2 = useHTMLProps(() => ({}), () => initialState);
		const b = result2().style;

		const result3 = useHTMLProps(() => ({}), () => ({ x: 200 }));
		const c = result3().style;

		expect(a).toEqual(b);
		expect(a).not.toEqual(c);
		expect(a).toEqual({ transform: 'translateX(100px)' });
		expect(c).toEqual({ transform: 'translateX(200px)' });
	});

	test('should generate the correct props when drag is enabled', () => {
		const result = useHTMLProps(() => ({ drag: true }), () => ({ x: 3 }));

		expect(result()).toEqual({
			draggable: false,
			style: {
				transform: 'translateX(3px)',
				userSelect: 'none',
				WebkitUserSelect: 'none',
				WebkitTouchCallout: 'none',
				touchAction: 'none',
			},
		});

		const resultX = useHTMLProps(() => ({ drag: 'x' }), () => ({ x: 3 }));

		expect(resultX()).toEqual({
			draggable: false,
			style: {
				transform: 'translateX(3px)',
				userSelect: 'none',
				WebkitUserSelect: 'none',
				WebkitTouchCallout: 'none',
				touchAction: 'pan-y',
			},
		});

		const resultY = useHTMLProps(() => ({ drag: 'y' }), () => ({ x: 3 }));

		expect(resultY()).toEqual({
			draggable: false,
			style: {
				transform: 'translateX(3px)',
				userSelect: 'none',
				WebkitUserSelect: 'none',
				WebkitTouchCallout: 'none',
				touchAction: 'pan-x',
			},
		});
	});
});
