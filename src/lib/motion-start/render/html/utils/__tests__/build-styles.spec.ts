/** Ported from framer-motion/packages/framer-motion/src/render/html/utils/__tests__/build-styles.test.ts */
import { describe, test, expect } from 'vitest';
import { buildHTMLStyles } from '../build-styles';
import type { DOMVisualElementOptions } from '../../../dom/types';
import type { ResolvedValues } from '../../../types';
import type { TransformOrigin } from '../../types';
import { createHtmlRenderState } from '../create-render-state';

describe('buildHTMLStyles', () => {
	test('Builds basic styles', () => {
		const latest = { width: 100 };
		const style: ResolvedValues = {};
		build(latest, { style });

		expect(style).toEqual({ width: '100px' });
	});

	test('Builds vars', () => {
		const latest = { '--width': 100 };
		const vars: ResolvedValues = {};
		build(latest, { vars });

		expect(vars).toEqual({ '--width': 100 });
	});

	test('Builds transform with default value types', () => {
		const latest = { x: 1, y: 0, rotateX: 90, transformPerspective: 200 };
		const style: ResolvedValues = {};
		build(latest, { style });

		expect(style).toEqual({
			transform: 'perspective(200px) translateX(1px) rotateX(90deg)',
		});
	});

	test('Builds perspective into the CSS perspective style', () => {
		const latest = { perspective: 100, transform: 'translateX(100px)' };
		const style: ResolvedValues = {};
		build(latest, { style });

		expect(style).toEqual({
			perspective: '100px',
			transform: 'translateX(100px)',
		});
	});

	test('Builds transform with defined value types', () => {
		const latest = { x: '1vw', y: '2%', rotateX: '90turn' };
		const style: ResolvedValues = {};
		build(latest, { style });

		expect(style).toEqual({
			transform: 'translateX(1vw) translateY(2%) rotateX(90turn)',
		});
	});

	test('Builds transform none if all transforms are default', () => {
		const latest = { x: 0, y: 0, scale: 1 };
		const style: ResolvedValues = {};
		build(latest, { style });

		expect(style).toEqual({
			transform: 'none',
		});
	});

	test('Builds transformOrigin with correct default value types', () => {
		const latest = { originX: 0.2, originY: '60%', originZ: 10 };
		const style: ResolvedValues = {};
		build(latest, { style });

		expect(style).toEqual({
			transformOrigin: '20% 60% 10px',
		});
	});

	test('Applies transformTemplate if provided', () => {
		const latest = { x: 1 };
		const style: ResolvedValues = {};
		build(latest, {
			style,
			config: {
				transformTemplate: ({ x }: any, gen: any) =>
					`translateY(${parseFloat(x as string) * 2}) ${gen}`,
			},
		});

		expect(style).toEqual({
			transform: 'translateY(2) translateX(1px)',
		});
	});
});

interface BuildProps {
	style: ResolvedValues;
	vars: ResolvedValues;
	transform: ResolvedValues;
	transformOrigin: TransformOrigin;
	config: DOMVisualElementOptions & { transformTemplate?: any };
}

function build(
	latest: ResolvedValues,
	{
		style = {},
		vars = {},
		transform = {},
		transformOrigin = {},
		config = {},
	}: Partial<BuildProps> = {}
) {
	const state = createHtmlRenderState();
	// Merge provided overrides
	Object.assign(state.style, style);
	Object.assign(state.vars, vars);
	Object.assign(state.transform, transform);
	Object.assign(state.transformOrigin, transformOrigin);

	buildHTMLStyles(state, latest, config.transformTemplate);

	// Copy results back to the passed-in objects
	Object.assign(style, state.style);
	Object.assign(vars, state.vars);
}
